# 🎓 Student Payment Management System 

Welcome to the **Student Payment Management System**! This project showcases a decentralized application (DApp) for managing student records using a Solidity smart contract and a Web3-powered front-end.  

---

## 🚀 About the Project  

This DApp allows users to fetch student details securely by entering their **School ID** and **Roll Number** in specific formats. It's an easy-to-use, decentralized system built for transparency and efficiency.  

---

## 📋 How to Test  

Want to try it out? Follow the testing instructions below:  

- **School ID Format:** Three digits (e.g., `001`).  
- **Roll Number Format:** Two digits (e.g., `01`).  

### Example Inputs:  

| **School ID** | **Roll Numbers** |  
|---------------|------------------|  
| `001`         | `01`, `02`       |  
| `002`         | `01`             |  

---

## 💡 Key Features  

- Decentralized student record management.  
- Simple, clear input formats for easy access.  
- Smart contract-based operations for trust and security.

## 📝 Solidity Code 
Here's the core Solidity code that powers this system:  

```
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract StudentPaymentsDetails {
    struct Student{
        uint roll;
        uint totalPayment;
        uint paid;
        uint dues;
        uint advancePayment;
    }

    mapping(uint=>mapping(uint=>Student)) stuData;

    function insertDetails(uint _school_id, uint _roll, uint _totalPayment, uint _paid) public {
        require(_school_id > 0, "Invalid school ID");
        require(_roll > 0, "Invalid roll number");
        require(_paid >= 0, "Paid amount cannot be negative");
        
        uint _advancePayment = 0;
        uint _dues = 0;

        if (_paid > _totalPayment) {
            _advancePayment = _paid - _totalPayment;
        } else if (_paid < _totalPayment) {
            _dues = _totalPayment - _paid;
        }

        // Store student details
        stuData[_school_id][_roll] = Student({
            roll: _roll,
            totalPayment: _totalPayment,
            paid: _paid,
            dues: _dues,
            advancePayment: _advancePayment
        });
}


    function createMonthlyFee(uint _school_id, uint _roll, uint _monthlyFee) public {
        require(stuData[_school_id][_roll].roll != 0,"Invalid school ID or roll number. Student does not exist.");

        Student storage studentPayment = stuData[_school_id][_roll];

        if(studentPayment.advancePayment > _monthlyFee){
            studentPayment.advancePayment -= _monthlyFee;
        }
        else{
            uint remainingFee = _monthlyFee - studentPayment.advancePayment;
            studentPayment.advancePayment = 0;
            studentPayment.dues += remainingFee;

        }
    }

    function addNewPayment(uint _school_id, uint _roll, uint _paymentAmount) public {
        require(stuData[_school_id][_roll].roll != 0,"Invalid school ID or roll number. Student does not exist.");

        Student storage studentPayment = stuData[_school_id][_roll];

        if(studentPayment.dues > 0){
            if(_paymentAmount >= studentPayment.dues){
                uint remaingPayment = _paymentAmount - studentPayment.dues;
                studentPayment.paid += studentPayment.dues;
                studentPayment.dues = 0;
                studentPayment.advancePayment += remaingPayment;
            }
            else{
                studentPayment.paid += _paymentAmount;
                studentPayment.dues -= _paymentAmount;
            }
        }else{
            studentPayment.paid += _paymentAmount;
            studentPayment.advancePayment += _paymentAmount;
        }

    }
    
    function getDetails(uint _school_id, uint _roll) public view returns(uint,uint, uint,uint,uint){
        Student memory student = stuData[_school_id][_roll];
        require(student.roll != 0, "Student not found");
        return (student.roll, student.totalPayment, student.paid, student.dues, student.advancePayment);
    }    
    

    
}
```

🌟🌟🌟 


