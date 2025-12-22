export const STUDENTS = [
    {
        id: 's1',
        name: 'Aditya Kumar',
        email: 'aditya@example.com',
        role: 'student',
        marks: [
            { subject: 'Mathematics', code: 'MAT101', marks: 85, status: 'Pass' },
            { subject: 'Physics', code: 'PHY101', marks: 32, status: 'Fail' },
            { subject: 'Chemistry', code: 'CHE101', marks: 78, status: 'Pass' },
            { subject: 'Computer Science', code: 'CS101', marks: 92, status: 'Pass' },
        ],
        revaluations: [
            { id: 'r1', subject: 'Physics', code: 'PHY101', status: 'Processing', date: '2023-11-25' }
        ]
    }
];

export const TEACHERS = [
    {
        id: 't1',
        name: 'Prof. Sharma',
        email: 'sharma@example.com',
        role: 'teacher',
        subjects: ['Physics', 'Mathematics'],
    }
];

export const REVALUATION_REQUESTS = [
    {
        id: 'r1',
        studentId: 's1',
        studentName: 'Aditya Kumar',
        registerNumber: 'REG2023001',
        subject: 'Physics',
        subjectCode: 'PHY101',
        currentMarks: 32,
        status: 'Processing', // Processing, Completed, Rejected
        paymentStatus: 'Paid',
        date: '2023-11-25',
    },
    {
        id: 'r2',
        studentId: 's2',
        studentName: 'Rahul Singh',
        registerNumber: 'REG2023005',
        subject: 'Mathematics',
        subjectCode: 'MAT101',
        currentMarks: 28,
        status: 'Pending',
        paymentStatus: 'Paid',
        date: '2023-11-26',
    }
];