const CONSTANTS = {
  // fetching statuses
  STATUS_IDLE: 0,
  STATUS_ERROR: -1,
  STATUS_WAITING: 1,
  STATUS_DONE: 2,

  // API Endpoint
  API_ENDPOINT: 'http://127.0.0.1:8000/api',
  API_CAMERAS: '/cameras',
  API_INCIDENTS: '/incidents',
  API_OBJECT_SETS: '/object_sets',
  API_OBJECTS: '/objects',
  API_VIDEOS: '/videos',
  SECRET_TOKEN_STORED_IN_A_NOT_SO_SECRET_LOCATION: 'secret-token-1',

  SOCKET_IO_ENDPOINT_DEV: 'http://localhost:3000',
  SOCKET_IO_ENDPOINT_PROD: 'TODO',

  // video sizes - TODO: scale page collapse
  VIDEO_THUMBNAIL_WIDTH: 160,
  VIDEO_THUMBNAIL_HEIGHT: 90,
  VIDEO_STREAMS_WIDTH: 320,
  VIDEO_STREAMS_HEIGHT: 180,
  VIDEO_MAIN_WIDTH: 640,
  VIDEO_MAIN_HEIGHT: 360,

  // pages
  PAGE_LANDING: 0,
  PAGE_SEARCH_RESULTS: 1,
  PAGE_SEARCH_RESULTS_NONE: 2,
  PAGE_INCIDENT_VIEWER: 3,
  PAGE_LIVE_STREAM: 4,
  PAGE_OBJECT_SET: 5,
};

export default CONSTANTS;
