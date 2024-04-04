import mongoose from "mongoose";

const employeeAttendenceSchema = mongoose.Schema(
    {
    EmpID: {
        type: String,
        required: true,
    },
    employeeName: {
        type: String,
        required: true,
    },
    Date: {
        type: String,
        required: true,
    },
    InTime: {
        type: String,
        //required: true,
    },
    OutTime: {
        type: String,
        //required: true,
    },
    Workinghours: {
        type: Number,
        //required: true,
    },
    OThours: {
        type: Number,
        //required: true,
    },
    

    }
);

export const EmployeeAttendence = mongoose.model('EmployeeAttendence' ,employeeAttendenceSchema);