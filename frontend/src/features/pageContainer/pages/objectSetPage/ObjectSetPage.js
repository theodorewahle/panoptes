import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addObjectToSet } from '../../../video/videoSlice';

import { TextField, Button } from '@material-ui/core';

import styles from './ObjectSetPage.module.scss';

const ObjectSetPage = (props) => {
  const dispatch = useDispatch();
  const [objectInput, setObjectInput] = useState('');
  const { objectSet } = props;
  if (objectSet == null) {
    console.log('TODO: display nice error message');
    return null;
  }
  const names = objectSet.objects.map((name) => {
    return <div className={styles.name}>{name}</div>;
  });
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(addObjectToSet({ setName: objectSet.name, objectInput }));
    // TODO: ping API
    setObjectInput('');
  };
  return (
    <div className={styles.containerLiveStream}>
      <h1>{objectSet.name}</h1>
      <h2>Objects Being Tracked:</h2>
      {names}
      <form className={styles.searchBar} onSubmit={(e) => onSubmit(e)}>
        <TextField
          id="outlined-basic"
          label="Add Object"
          variant="outlined"
          value={objectInput}
          fullWidth={true}
          onChange={(e) => setObjectInput(e.target.value)}
        />
        <Button
          type="submit"
          variant="outlined"
          size="large"
          disabled={objectInput.length > 0 ? false : true} // TODO
        >
          Go
        </Button>
      </form>
    </div>
  );
};

export default ObjectSetPage;
