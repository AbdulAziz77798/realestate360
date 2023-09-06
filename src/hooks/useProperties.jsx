import React from 'react'
import { useQuery } from 'react-query';
import { getAllproperties } from '../utils/api.js';

const useProperties = () => {
    const {data,isError,isLoading,refetch} = useQuery("allProperties",getAllproperties,{refetchOnWindowFocus:false});
  return {
    data,
    isError,
    isLoading,
    refetch,
  }
}

export default useProperties