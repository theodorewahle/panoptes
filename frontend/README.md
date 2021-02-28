# Frontend

### React

- Bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.
- [Node](https://nodejs.org/en/) version 10 or greater
- `yarn start` to run locally.

### Wireframe

[Figma wireframe](https://www.figma.com/file/zwLgHEGFp7gkeKQ7k8zTEx/Panoptes-Wireframe?node-id=0%3A1)

### TODO

- CSS work (low priority)
- Clean up and sort imports in all files
- If not handled on backend, incidents need to be trimmed
  - [react-video-trimmer](https://www.npmjs.com/package/react-video-trimmer)
  - Implement something similar to above in conjunction with [react-player](https://www.npmjs.com/package/react-player)
- Add / Update / Delete Cameras from UI (APIs are already in place)
- Rough UI outline of basic functionality
  - Add/Update Object Set Page
  - Search Results Page
- Build a video player? Some libraries...
  - [react-player](https://www.npmjs.com/package/react-player) (currently using this)
  - [video-react](https://video-react.js.org/)
  - [shake-player](https://www.npmjs.com/package/shaka-player)
  - [video.js](https://www.npmjs.com/package/video.js)
  - ...
- Make sure every page collapses cleanly all the way to mobile version
- Deploy
  - [Heroku](https://www.heroku.com/)?
  - Serve front-end [with flask](https://stackoverflow.com/questions/44209978/serving-a-front-end-created-with-create-react-app-with-flask)?
- ...

### APIs

- Waiting for new object_set endpoint. See comment on [PR #16](https://github.com/theodorewahle/panoptes/pull/16)
