const contractABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_school_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_roll",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_paymentAmount",
				"type": "uint256"
			}
		],
		"name": "addNewPayment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_school_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_schoolName",
				"type": "string"
			}
		],
		"name": "addSchool",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_school_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_roll",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_monthlyFee",
				"type": "uint256"
			}
		],
		"name": "createMonthlyFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_school_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_roll",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_totalPayment",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_paid",
				"type": "uint256"
			}
		],
		"name": "insertDetails",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "getAllSchools",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "school_id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "schoolName",
						"type": "string"
					}
				],
				"internalType": "struct StudentPaymentsDetails.School[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_school_id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_roll",
				"type": "uint256"
			}
		],
		"name": "getDetails",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "schools",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "school_id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "schoolName",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const contractAddress = "0xCe9322e0c09636A637339B9ED71427207363AC30";

let web3;
let contract;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: "eth_requestAccounts" });
        contract = new web3.eth.Contract(contractABI, contractAddress);

        console.log("Connected to MetaMask");
    } else {
        alert("Please install MetaMask!");
    }

	const addSchoolContainer = document.querySelector('.addSchool');
	try{
		// calling getAllSchools function
		const school = await contract.methods.getAllSchools().call();
		console.log("school",school);
		const schoolItemsContainer = document.getElementById("schoolItemsContainer");
		school.forEach(sch => {
			const schoolItemHTML = `
                <div class="school-item">
                  <div class="school-name">${sch.schoolName}</div>
                  <div class="school-id">${sch.school_id}</div>
                </div>`;
            schoolItemsContainer.innerHTML += schoolItemHTML;
			
		});


		// show address in ui
		const contractAddressVal = document.getElementById('contractAddress');
		contractAddressVal.innerHTML=contractAddress;
		contractAddressVal.href = `https://sepolia.etherscan.io/address/${contractAddress}`;
		contractAddressVal.target = "_blank";

		// hide addSchool container if not owner 
		
		const owner = await contract.methods.owner().call();
		
		const accounts = await web3.eth.getAccounts();
        const currentAccount = accounts[0];
		if(currentAccount.toLowerCase() === owner.toLowerCase()){
			addSchoolContainer.style.display = "block";
		}
		else{
			addSchoolContainer.style.display = "none";
		}

	}
	catch(err){
		console.log(err);
		
	}
});

document.getElementById('addButton').addEventListener('click', async()=>{
	const schoolId = document.getElementById('addSchoolId').value;
	const schoolName = document.getElementById("addSchoolName").value;

	if (!schoolId || schoolId <= 0) {
        alert("Invalid School ID");
        return;
    }

    if (!schoolName || schoolName.trim() === "") {
        alert("School Name cannot be empty");
        return;
    }

	

	try{
		const accounts = await web3.eth.getAccounts();
		await contract.methods
			.addSchool(schoolId,schoolName)
			.send({from: accounts[0]});
		alert("School inserted Successfully!")
	}
	catch(err){
		console.error(err);
        alert("Failed to insert schools.");
	}
})


// Insert Student Details
document.getElementById("insertButton").addEventListener("click", async () => {
    const schoolId = document.getElementById("schoolId").value;
    const roll = document.getElementById("roll").value;
    const totalPayment = document.getElementById("totalPayment").value;
    const paid = document.getElementById("paid").value;

    const accounts = await web3.eth.getAccounts();

    try {
        await contract.methods
            .insertDetails(schoolId, roll, totalPayment, paid)
            .send({ from: accounts[0] });

        alert("Student details inserted successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to insert details.");
    }
});

// create fee
document.getElementById("makePaymentBtn").addEventListener('click',async()=>{
    const schoolId = document.getElementById("createFeeSchoolId").value;
    const roll = document.getElementById("createFeeRoll").value;
    const monthlyFee = document.getElementById("monthlyFee").value;

    const accounts = await web3.eth.getAccounts();

    try{
        await contract.methods.createMonthlyFee(schoolId,roll,monthlyFee).send({from: accounts[0]});
        alert("Monthly Fee created successfully");
    }
    catch(err){
        console.error(err);
        alert("Failed to create monthly fee");
    }
});

// received payment
document.getElementById("paymentReceivedBtn").addEventListener('click',async()=>{
    const schoolId = document.getElementById("receivedPaymentSchollId").value;
    const roll = document.getElementById("receivedPaymentRoll").value;
    const paymentAmount = document.getElementById("paymentAmount").value;

    const accounts = await web3.eth.getAccounts();

    try{
        await contract.methods.addNewPayment(schoolId,roll,paymentAmount).send({from: accounts[0]});
        alert("Payment received successfully");
    }
    catch(err){
        console.error(err);
        alert("Failed to received payment");
    }
});

// Fetch Student Details
document.getElementById("fetchButton").addEventListener("click", async () => {
    const schoolId = document.getElementById("fetchSchoolId").value;
    const roll = document.getElementById("fetchRoll").value;

    try {
        const result = await contract.methods.getDetails(schoolId, roll).call();

        if (result[0] == "0") {
            document.getElementById("output").innerHTML = "Student not found.";
            return;
        }

        document.getElementById("output").innerHTML = `
            <strong>Roll:</strong> ${result[0]}<br>
            <strong>Total Payment:</strong> ${result[1]}<br>
            <strong>Paid:</strong> ${result[2]}<br>
            <strong>Dues:</strong> ${result[3]}<br>
            <strong>Advance Payment:</strong> ${result[4]}
        `;
    } catch (err) {
        console.error(err);
        alert("Failed to fetch details. Make sure the inputs are correct.");
    }
});




