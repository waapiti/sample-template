import React, { useEffect } from 'react';
import { Template, Description } from '@waapiti/templates';
import App from './App.tsx';
import DESCRIPTION from '../Waapiti.json';

const Root = () => {
  const [description, setDescription] = React.useState<Description>();

  useEffect(() => {
    const getData = async () => {
      if (process.env.NODE_ENV === 'development') {
        const data = await fetch('./Waapiti.json');
        const json = await data.json();
        setDescription(json);
      } else {
        const data = DESCRIPTION as Description;
        setDescription(data);
        return;
      }
    };
    try {
      getData();
    } catch (e) {
      console.log(e);
    }
  }, []);

  if (!description) return;

  return (
    <Template json={description}>
      <App />
    </Template>
  );
};

export default Root;
