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
	}
];

const contractAddress = "0xC21390F0E3738d7b1972Cf35b670fB8F5C8a610F";

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
});

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




