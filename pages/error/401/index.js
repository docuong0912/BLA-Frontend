import React, { useEffect } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import Link from 'next/link';
import { removeToken } from '@/components/auth/auth';

const Error401 = () => {

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
        <Image className='w-100' src={'/error/error_401.jpg'} width={800} height={600}/>
        <button onClick={()=>removeToken()} className='btn btn-large btn-success'>
            <Link className='text-white' href={`/home`}>Return</Link>
        </button>
    </div>
  )
}

export default Error401
Error401.getLayout = page=>{
    return(
        <Layout>
            {page}
        </Layout>
    )
}