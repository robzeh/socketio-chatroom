import * as React from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MangaFormData } from '../../models/types';
import fs from 'fs';
import JSZip from 'jszip';

type MangaFormProps = {

};

const MangaForm = ({ }: MangaFormProps) => {
  const { register, handleSubmit, errors } = useForm<MangaFormData>();
  const [test, setTest] = React.useState<string[]>([]);
  const [i, setI] = React.useState(10);

  const mangaState: any[] = [];
  const onSubmit = handleSubmit(async ({ file }) => {
    console.log(file[0])
    //const buffer = await file[0].arrayBuffer();
    const zip = await JSZip.loadAsync(file[0]);
    zip.forEach(async (t, file) => {
      const data = await file.async('base64'); // array buffer, send to state array, emit on page by page basis
      mangaState.push(data);
      setTest((prev) => [...prev, data]);
      //const pic = 'data:image/png;base64,' + data;
      //const img = new Image();
      //img.src = pic;
      //document.body.appendChild(img);
    })
    console.log(mangaState)
  });

  const onClick = () => {

    console.log(test);
    const base64 = test[i];
    const img = document.getElementById('page');
    img?.setAttribute('src', 'data:image/png;base64,' + base64);
    setI(i + 1);
    console.log(i);
    console.log(base64);
  }


  return (
    <Box>
      <form onSubmit={onSubmit}>
        <FormControl>
          <FormLabel>Upload a CBZ</FormLabel>
          <Input type='file' name='file' ref={register} />
          <Button type='submit'></Button>
        </FormControl>
      </form>
      <Button onClick={onClick}>IMAGE</Button>
      <Box>
        <img id='page' />
      </Box>
    </Box>
  );

};

export { MangaForm };