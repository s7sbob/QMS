// src/data/sampleUsers.ts
export interface User {
    id: number;
    fName: string;
    lName: string;
    dateOfBirth: string;
    crtDate: string;
    userName: string;
    password: string;
    email: string;
    userImgUrl?: string;
  }
  
  const sampleUsers: User[] = [
    {
      id: 1,
      fName: "Ahmed",
      lName: "Ali",
      dateOfBirth: "1990-01-01",
      crtDate: "2022-01-01",
      userName: "ahmedali",
      password: "12345",
      email: "ahmed@example.com",
      userImgUrl: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      fName: "Sara",
      lName: "Mohamed",
      dateOfBirth: "1992-05-15",
      crtDate: "2022-02-01",
      userName: "saramohamed",
      password: "12345",
      email: "sara@example.com",
      userImgUrl: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      fName: "John",
      lName: "Doe",
      dateOfBirth: "1985-10-20",
      crtDate: "2022-03-01",
      userName: "johndoe",
      password: "12345",
      email: "john@example.com",
      userImgUrl: "https://via.placeholder.com/150",
    },
  ];
  
  export default sampleUsers;
  