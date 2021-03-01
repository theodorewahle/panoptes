import store from '../../../../app/store';
import { setSearchResults, setStatusSearch } from '../../../video/videoSlice';
import ENV from '../../../../env';

// NOTE: API GET /search?object_name={object_id} does not include camera_id
//       --> running search client-side
// TODO: if search does not yield results, check if it is in object_sets
//       (have not implemented object_sets page / need to double check use cases)
// TODO: if search results match adjusted text, display: "Showing results for {adjusted_search}"
export const processSearch = ({ mainDataModel, searchCurrent }) => {
  const results = [];
  const search = searchCurrent.toLowerCase().trim();
  const search2 = search.replace(/\W/g, '');
  console.log(`search2: ${search2}`);
  for (let i = 0; i < mainDataModel.length; i++) {
    const incidentsArr = mainDataModel[i].incidents;
    for (let j = 0; j < incidentsArr.length; j++) {
      const incident = incidentsArr[j];
      const objIdentified = incident.objectIdentified.toLowerCase();
      const objIdentified2 = objIdentified.replace(/\W/g, '');
      if (
        objIdentified === search ||
        objIdentified === search2 ||
        objIdentified2 === search ||
        objIdentified2 === search2
      ) {
        results.push(incident);
      }
    }
  }
  store.dispatch(setSearchResults(results));
  if (results.length === 0) {
    store.dispatch(
      setStatusSearch({
        status: ENV.STATUS_NO_RESULTS,
        message: `No results for "${searchCurrent}"`,
      })
    );
  } else {
    store.dispatch(
      setStatusSearch({
        status: ENV.STATUS_DONE,
        message: `${results.length} results match your search for "${searchCurrent}"`,
      })
    );
  }
};
