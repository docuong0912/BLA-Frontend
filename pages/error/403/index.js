import Image from "next/image";
import Layout from "../../../components/Layout";
import Link from "next/link";
const UnpermittedPage = () => {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <Image src={"/error/error-403.jpg"} alt="403" width={1000} height={600} />
            <button  className='btn btn-large btn-success'>
                <Link className='text-white' href={`/home`}>Return</Link>
            </button>
        </div>
    );
}
UnpermittedPage.getLayout = page => {
    return (
        <Layout>
            {page }
        </Layout>
    );
}
export default UnpermittedPage;