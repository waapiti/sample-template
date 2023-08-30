import React from 'react';
import { TemplateContext, Text, Background, Helpers } from '@waapiti/templates';

import './App.css';

function App() {
  const { vars } = React.useContext(TemplateContext);

  return (
    <div className='template'>
      <Background video={vars.backgroundVideo.value} image={vars.backgroundImage.value} color={vars.theme.value.background} overlay={0} />
      <div className='flex relative flex-col w-full h-full z-10'>
        {vars.logo.value && (
          <div className='logo'>
            <img src={vars.logo.value} alt='logo' />
          </div>
        )}
        <div className='content-container'>
          <Text
            animated={false}
            style={{
              color: vars.theme.value.primary,
              lineHeight: `${vars.text1.value.size}rem`,
              fontSize: `${vars.text1.value.size}rem`,
            }}
            key={'text1'}
            className='text1'
          >
            {vars.text1.value.text}
          </Text>
          <Text
            animated={false}
            style={{
              color: vars.theme.value.primary,
              lineHeight: `${vars.text2.value.size}rem`,
              fontSize: `${vars.text2.value.size}rem`,
            }}
            key={'text2'}
            className='text2'
          >
            {vars.text2.value.text}
          </Text>
        </div>
        <div className='flex flex-col w-full footer'>
          <Text
            animated={false}
            style={{
              color: vars.theme.value.primary ? Helpers.mix(vars.theme.value.primary, '#ffffff', 0.4) : vars.theme.value.primary,
              fontSize: `${vars.text3.value.size}rem`,
            }}
            key={'text3'}
            className='text3'
          >
            {vars.text3.value.text}
          </Text>
          <Text
            animated={false}
            style={{
              color: vars.theme.value.secondary,
              lineHeight: `${vars.text4.value.size}rem`,
              fontSize: `${vars.text4.value.size}rem`,
            }}
            key={'text4'}
            className='text4'
          >
            {vars.text4.value.text}
          </Text>
        </div>
      </div>
    </div>
  );
}

export default App;
