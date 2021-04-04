import * as React from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MangaContextType, MangaFormData, UserContextType } from '../../models/types';
import JSZip from 'jszip';
import { useUser } from '../../contexts/UserProvider';
import { useManga } from '../../contexts/MangaProvider';

type MangaFormProps = {
  reading: boolean
  toggleReading: () => void
};

const MangaForm = ({ reading, toggleReading }: MangaFormProps) => {
  const { register, handleSubmit, errors } = useForm<MangaFormData>();
  const { userDetails }: UserContextType = useUser();
  const [test, setTest] = React.useState<string[]>([]);
  const [i, setI] = React.useState(10);
  const { state, dispatch }: MangaContextType = useManga();

  const mangaState: any[] = [];
  const onSubmit = handleSubmit(async ({ file }) => {
    console.log(file[0])
    //const buffer = await file[0].arrayBuffer();
    const zip = await JSZip.loadAsync(file[0]);
    // will this still finish after toggleReading?
    zip.forEach(async (t, file) => {
      const data = await file.async('base64'); // array buffer, send to state array, emit on page by page basis
      const pageAsBlob = await file.async('blob');
      dispatch({ type: 'setPages', payload: pageAsBlob });
      //mangaState.push(data);
      //setTest((prev) => [...prev, data]);
      //const pic = 'data:image/png;base64,' + data;
      //const img = new Image();
      //img.src = pic;
      //document.body.appendChild(img);
    })
    console.log(mangaState)
    toggleReading();
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
    <>
      {userDetails.roomOwner ? (
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
      ) : (
        <Box>
          <h1>suggest</h1>
        </Box>
      )}
    </>
  );

};

export { MangaForm };