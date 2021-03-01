import store from '../../../../app/store';
import { setSearchResults, setStatusSearch } from '../../../video/videoSlice';
import ENV from '../../../../env';

// NOTE: API GET /search?object_name={object_id} does not include camera_id
//       --> running search client-side
// TODO: if search does not yield results, check if it is in object_sets
//       (have not implemented object_sets page / need to double check use cases)
export const processSearch = ({ mainDataModel, searchCurrent }) => {
  const results = [];
  const search = searchCurrent.toLowerCase();
  for (let i = 0; i < mainDataModel.length; i++) {
    const incidentsArr = mainDataModel[i].incidents;
    for (let j = 0; j < incidentsArr.length; j++) {
      const incident = incidentsArr[j];
      if (incident.objectIdentified.toLowerCase() === search) {
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
