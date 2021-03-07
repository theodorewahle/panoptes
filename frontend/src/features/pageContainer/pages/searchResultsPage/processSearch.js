import store from '../../../../app/store';
import {
  setSearchResults,
  setStatusSearch,
  setSearchFilterObjects,
} from '../../../video/videoSlice';
import ENV from '../../../../env';

const isFiltered = ({ title, searchFilter }) => {
  for (let filter of Object.keys(searchFilter)) {
    if (title === filter && searchFilter[filter]) {
      return true;
    }
  }
  return false;
};

// NOTE: API GET /search?object_name={object_id} does not include camera_id
//       --> running search client-side
// TODO: if search does not yield results, check if it is in object_sets
//       (have not implemented object_sets page / need to double check use cases)
// TODO: if search results match adjusted text, display: "Showing results for {adjusted_search}"
export const processSearch = ({
  mainDataModel,
  searchCurrent,
  searchFilterCameras,
  searchFilterObjects,
  isNewSearch,
}) => {
  let numResults = 0;
  const results = [];
  let objects;
  if (isNewSearch) {
    objects = {};
  } else {
    objects = { ...searchFilterObjects };
  }
  const search = searchCurrent.toLowerCase().trim();
  const search2 = search.replace(/\W/g, '');
  for (let i = 0; i < mainDataModel.length; i++) {
    if (
      isFiltered({
        title: mainDataModel[i].title,
        searchFilter: searchFilterCameras,
      })
    ) {
      console.log('entered here');
      const incidentsArr = mainDataModel[i].incidents;
      for (let j = 0; j < incidentsArr.length; j++) {
        const incident = incidentsArr[j];
        const objIdentified = incident.objectIdentified.toLowerCase();
        const objIdentified2 = objIdentified.replace(/\W/g, '');
        if (
          search.includes(objIdentified) ||
          search2.includes(objIdentified) ||
          search.includes(objIdentified2) ||
          search2.includes(objIdentified2)
        ) {
          numResults++;
          const addIncident = () => {
            const tempIncident = { ...incident };
            tempIncident['title'] = incident.timeStamp;
            results.push(tempIncident);
          };
          if (isNewSearch) {
            objects[incident.objectIdentified] = true;
            addIncident();
          } else if (
            isFiltered({
              title: incident.objectIdentified,
              searchFilter: searchFilterObjects,
            })
          ) {
            addIncident();
          }
        }
      }
    }
  }
  // TODO: display secondary message for numResults from filters
  console.log(`numResults: ${numResults}`);
  let messageFilter = '';
  if (results.length === 0) {
    store.dispatch(
      setStatusSearch({
        status: ENV.STATUS_NO_RESULTS,
        message: `No results for "${searchCurrent}"`,
      })
    );
  } else {
    let message = '';
    if (results.length === 1) {
      message = `1 result matches your search for "${searchCurrent}"`;
    } else {
      message = `${results.length} results match your search for "${searchCurrent}"`;
    }
    store.dispatch(
      setStatusSearch({
        status: ENV.STATUS_DONE,
        message,
        messageFilter,
      })
    );
  }
  store.dispatch(setSearchFilterObjects(objects));
  store.dispatch(setSearchResults(results));
};
