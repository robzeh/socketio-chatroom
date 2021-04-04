import * as React from 'react';
import { Box, Image } from '@chakra-ui/react';
import { useManga } from '../../contexts/MangaProvider';
import { MangaContextType } from '../../models/types';

type ReaderProps = {

};

const Reader = ({ }: ReaderProps) => {
  const [page, setPage] = React.useState();
  const { state, dispatch }: MangaContextType = useManga();

  // useEffect, setPage chunks from sockoet

  return (
    <Box>
      <h1>HI</h1>
      <Image src={page} />
    </Box>
  );

};

export { Reader };