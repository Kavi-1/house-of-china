import Nav from "./components/Nav";
import Image from "next/image";
import Link from "next/link";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Footer from "./components/Footer";
import CallIcon from '@mui/icons-material/Call';
import ImageRotate from './components/ImageRotate';

export default function Home() {


  return (
    <>
      <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="absolute top-0 left-0 right-0 z-50">
          <Nav />
        </div>
        <div className="relative h-full w-full">
          <ImageRotate />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="flex flex-col items-center justify-center mb-2 w-full">
                <h1 className="font-chinese text-6xl font-bold text-white tracking-widest mb-2 text-center w-full drop-shadow-2xl">House of China</h1>
                <a href="tel:(813)949-5800" className="font-poppins text-xl mb-2 mt-0 text-white text-center w-full">(813) 949-5800</a>
              </div>
              <Link href="/menu">
                <button className="bg-transparent text-white border-2 border-white px-8 py-3 rounded-full text-xl font-bold hover:bg-white hover:text-black hover:cursor-pointer transition">
                  View Menu
                </button>
              </Link>
              <div className="text-white/90 font-poppins mt-6 text-lg font-semibold tracking-wide text-center drop-shadow-lg">
                ORDER ONLINE ONLY NO DELIVERY
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-64 w-full bg-white py-10 px-4 flex justify-center items-center">
        <div id="about" className="font-poppins max-w-3xl py-0 w-full text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to House of China</h2>
          <p className="text-md text-gray-700 mb-8">
            House of China is located at 18643 U.S HWY 41, NORTH, Lutz, FL 33549. We are dedicated to serve the finest and freshest foods. We welcome you to order and eat our delicious Chinese cuisine!
          </p>
        </div>
      </div>
      <div className="min-h-64 bg-red-500 flex flex-col items-center justify-center text-white font-poppins p-6 px-18 grid grid-cols-1 md:grid-cols-2">
        <div className="h-full flex flex-col items-center mb-4 md:mb-0">
          <div>
            <AccessTimeIcon />
          </div>
          <h3 className="text-2xl font-bold mb-2 py-2">Business Hours</h3>
          <div className="text-md leading-relaxed text-center">
            Mon.-Thur. 11am-9pm<br />
            Fri. 11am-9:30pm<br />
            Sat. 12noon-9:30pm<br />
            Sunday Closed
          </div>
        </div>
        <div id="contact" className="flex flex-col items-center h-full md:mb-0">
          <div>
            <CallIcon />
          </div>
          <h3 className="text-2xl font-bold mb-2 py-2">Call Us</h3>
          <a href="tel:(813)949-5800" className="text-md leading-relaxed text-center hover:text-blue-200">(813) 949-5800</a>
        </div>
      </div>
      <Footer />
    </>
  );
}
