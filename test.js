import moment from 'moment'
// var CurrentDate = moment().format();
// console.log(CurrentDate)
let currentDate=moment().format('YYYY-MM-DD')

console.log(currentDate)
let DATE = "2022-07-26T09:50:29.000Z"
// let newDate=DATE.toLocaleDateString()
let newDate=DATE.split('T')[0];
// split(' ')[0];
console.log(newDate)
let actualDate = moment().utcOffset(0, true).format()
console.log(actualDate)
// var main = {};
// "meetingDateTime": "2022-07-18T010:50:29.000Z",
// const email =`email":"`;
// console.log(email);
// const arr = ["cat","dog","fish"];
// arr.forEach((element) => {
    
//   var data =`${email}${element}`;
//   console.log(data)
//   main.push(data);
// });

// main.forEach((element) => {
    
//     console.log(element)
//   });
// const replaced = str.replaceAll("'", '"');
// var outputstr= main.replace(/'/g,'"');
// console.log(outputstr)


// {'email': 'siddharthelitemindz@gmail.com','email':'mayankvashistha@elitemindz.co'},
// achievement: "sadgdsag"
// companyName: "bridger"
// designation: "md"
// firstName: "chaman"
// id: 53
// lastName: "popli"
// masterId: 10
// meetingDate: "2022-07-18"
// meetingDateTime: "2022-07-18T20:11:00.000Z"
// pictureUrl: "http://192.168.1.111:3000/api/v1/dashboard/createContacts/uploadImage/image_1657957063819.jpg"
// primaryObjective: "dsfhgsf"
// secondaryObjective: "dsfhgdsg"
// subcontactsUserId: 9




//! LOOP DATA
// filterData(res:any){
//     for(let i=0; i<=res.length-1; i++){
//       let contactssub = res[i].contactssub
//       for(let j=0; j<=contactssub.length-1; j++){
//         let meetinglist = contactssub[j].meetinglist
//           for(let k=0; k<=meetinglist.length-1; k++){
//             this.allMeeting.push(meetinglist[k])
//             for(let l=0; l<=this.allMeeting.length-1; l++){
//               this.allMeeting[l].masterId = res[i].contactssub[0].masterUserId
//               this.allMeeting[l].firstName = res[i].firstName
//               this.allMeeting[l].lastName = res[i].lastName
//               this.allMeeting[l].companyName = res[i].companyName
//               this.allMeeting[l].designation = res[i].designation
//               this.allMeeting[l].pictureUrl = res[i].pictureUrl
//             };
//         }
//       };
//     }
  
//     console.log('allMeetingList-', this.allMeeting)
//    }