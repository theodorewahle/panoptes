# Frontend

### React

- Bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
- [Node](https://nodejs.org/en/) version 10 or greater
- `yarn start` to run locally.

### Wireframe

[Figma wireframe](https://www.figma.com/file/zwLgHEGFp7gkeKQ7k8zTEx/Panoptes-Wireframe?node-id=0%3A1)

### TODO

- High Priority
  - Bugs
    - update camera name -> search for incident -> incidents don't display updated camera name
  - Test different browsers / versions
  - `seekTo` button for startTime
  - Filter Incidents options (`timeStamp`, `camera`, `object`) in `SearchResultsPage`, `LiveStreamPage`, & `LandingPage`
- Misc
  - Clean up and sort imports in all files
  - Add timeouts to API calls
  - CSS work (low priority)
  - Make sure every page collapses cleanly all the way to mobile version
  - [Lazy load](https://reactjs.org/docs/code-splitting.html#reactlazy) videos
  - If not handled on backend, incidents need to be trimmed
    - [react-video-trimmer](https://www.npmjs.com/package/react-video-trimmer)
    - Implement something similar to above in conjunction with [react-player](https://www.npmjs.com/package/react-player)
- Warnings
  - The YouTube player is not attached to the DOM. API calls should be made after the onReady event. See more: https://developers.google.com/youtube/iframe_api_reference#Events
- Build a video player? Some libraries...
  - [react-player](https://www.npmjs.com/package/react-player) (currently using this)
  - [video-react](https://video-react.js.org/)
  - [shake-player](https://www.npmjs.com/package/shaka-player)
  - [video.js](https://www.npmjs.com/package/video.js)
  - ...
- Deploy
  - [Heroku](https://www.heroku.com/)?
  - Serve front-end [with flask](https://stackoverflow.com/questions/44209978/serving-a-front-end-created-with-create-react-app-with-flask)?
- ...

### APIs

- Waiting for new object_set endpoint. See comment on [PR #16](https://github.com/theodorewahle/panoptes/pull/16)
