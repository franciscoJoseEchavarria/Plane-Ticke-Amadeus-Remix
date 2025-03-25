

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-6 mt-auto border-t border-gray-300">
      <div className="container mx-auto flex justify-evenly items-center px-6">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Amadeus IT Group SA
        </p>
        <div className="flex space-x-4 ">
          <a
            href="https://www.facebook.com/AmadeusITGroup/"
            aria-label="Facebook"
          >
            <i className="ri-facebook-box-line text-2xl "></i>
          </a>
          <a
            href="https://www.instagram.com/amadeusitgroup"
            aria-label="Instagram"
          >
            <i className="ri-instagram-line text-2xl"></i>
          </a>
          <a
            href="https://www.youtube.com/user/AmadeusITGroup"
            aria-label="YouTube"
          >
            <i className="ri-youtube-line text-2xl"></i>
          </a>
          <a
            href="https://twitter.com/AmadeusITGroup"
            aria-label="twitter"
          >
            <i className="ri-twitter-x-fill text-2xl"></i>
          </a>
          <a
            href="https://www.linkedin.com/company/amadeus"
            aria-label="LinkedIn"
          >
            <i className="ri-linkedin-box-line text-2xl"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
