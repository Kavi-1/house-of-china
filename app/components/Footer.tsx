import CopyrightIcon from '@mui/icons-material/Copyright';

export default function Footer() {
    return (
        <>
            <footer className="font-poppins h-16 flex justify-center items-center text-white" style={{ backgroundColor: '#28354aff' }}>
                <CopyrightIcon sx={{ fontSize: 24 }} />
                <p className="ml-1"> HOUSE OF CHINA </p>
                <p className="text-white/50 px-4"> Developed by Kavi </p>
            </footer>
        </>
    )
}