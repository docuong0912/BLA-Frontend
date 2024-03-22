import Layout from '@/components/Layout'
import SideBar from '@/components/SideBar'
import React from 'react'

const GroupAssignment = () => {
  return (
    <div>GroupAssignment</div>
  )
}

export default GroupAssignment
GroupAssignment.getLayout = page=>{
    return(
        <Layout>
            
                {page}
            
        </Layout>
    );
}