// TODO: communicate with back-end coders on how they want to send this info
export const initStreams = [
  {
    title: 'Beautiful Nature',
    url: 'https://www.youtube.com/watch?v=P7d1H83IcjE',
    // ...,
  },
  {
    title: 'Alpha Chi Alpha Parking Lot',
    url: 'http://admin:admin@172.24.28.36/tmpfs/auto.jpg',
    camera_id: 'alpha_chi_parking_lot',
  },
  {
    title: 'Random Scenery',
    url: 'https://www.youtube.com/watch?v=hZSPmqAddzs',
  },
];

export const initRecentIncidents2 = [
  {
    title: 'Brown Bear Shows Off its Fishing Skills',
    url: 'https://www.youtube.com/watch?v=ZESQW2HQJZc',
  },
  {
    title: 'Bear Sits Next to Guy',
    url: 'https://www.youtube.com/watch?v=rbE53XUtVw0',
  },
  {
    title: 'Anan Creek Black Bear Eating a Salmon',
    url: 'https://www.youtube.com/watch?v=aYghin2HM9Q',
  },
  {
    title: 'Grizzly Bears Catching Salmon',
    url: 'https://www.youtube.com/watch?v=TSSPDwAQLXs',
  },
  {
    title: 'Brown Bear Eating Fish',
    url: 'https://www.youtube.com/watch?v=jAQieQ7l3HI',
  },
];

export const initRecentIncidents = [
  {
    title: 'Live Video Feed',
    url: 'http://localhost:8080/webcam.ogg',
    type: 'video/ogg',
  },
  {
    title: 'Woman Walking With Notebook',
    url: 'http://127.0.0.1:8000/incident/20210218/A210218_003304_003318.mp4',
    type: 'video/mp4',
  },
  {
    title: 'Garbage Truck',
    url: 'http://127.0.0.1:8000/incident/20210219/A210219_234913_234927.mp4',
    type: 'video/mp4',
  },
  {
    title: 'Woman With Suspicious Dog',
    url: 'http://127.0.0.1:8000/incident/20210218/A210218_020152_020207.mp4',
    type: 'video/mp4',
  },
  {
    title: 'Inividual Removes Suspicious Envelope From Vehicle',
    url: 'http://127.0.0.1:8000/incident/20210218/A210218_032104_032118.mp4',
    type: 'video/mp4',
  },
  {
    title: 'Suspicious Trio Enters Vehicle, Camera Disturbance',
    url: 'http://127.0.0.1:8000/incident/20210219/A210219_122703_122717.mp4',
    type: 'video/mp4',
  },
];

// placeholder until 'title' or 'name' is added to GET /cameras
export const mainDataModel = [
  {
    title: 'Beautiful Nature',
    url: 'https://www.youtube.com/watch?v=P7d1H83IcjE',
    camera_id: '0',
    incidents: [],
    // ...,
  },
  {
    title: 'Alpha Chi Alpha Parking Lot',
    url: 'http://admin:admin@172.24.28.36/tmpfs/auto.jpg',
    camera_id: '1',
    incidents: [
      {
        url: 'http://127.0.0.1:8000/incident/demo/demo1.mp4',
        startTime: '8:01PM',
        endTime: '8:02PM',
        objectIdentified: 'JT',
      },
      {
        url: 'http://127.0.0.1:8000/incident/demo/demo2.mp4',
        startTime: '9:01PM',
        endTime: '9:02PM',
        objectsIdentified: 'Computer',
      },
      {
        url: 'http://127.0.0.1:8000/incident/demo/demo3.mp4',
        startTime: '10:35PM',
        endTime: '10:36PM',
        objectsIdentified: 'Fan',
      },
      {
        url: 'http://127.0.0.1:8000/incident/demo/demo4.mp4',
        startTime: '12:42PM',
        endTime: '12:43PM',
        objectsIdentified: 'Light',
      },
      {
        url: 'http://127.0.0.1:8000/incident/demo/demo5.mp4',
        startTime: '1:52am',
        endTime: '1:52am',
        objectsIdentified: 'Fan',
      },
    ],
    objectSets: 'SEE BELOW', // unsure if objectSets correlate with camera_ids
  },
  {
    title: 'Random Scenery',
    url: 'https://www.youtube.com/watch?v=hZSPmqAddzs',
    camera_id: '2',
    incidents: [],
  },
];

// placeholder until GET /objects & GET /object_sets is merged
export const objectSets = [
  {
    name: 'Vehicles',
    object_set_id: 'NO REASON TO DISPLAY THIS',
    objects: ['Red Truck', 'Blue Car', 'Green Car', 'Pink Car'],
  },
  {
    name: 'Kitchen Appliances',
    object_set_id: 'NO REASON TO DISPLAY THIS',
    objects: ['Knife', 'Fork', 'Spoon', 'Plates', 'Bowls'],
  },
];
