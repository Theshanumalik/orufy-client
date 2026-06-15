import banner from "../assets/banner.png";
import bannerPoster from "../assets/banner-poster.jpg";
import { Outlet } from "react-router";

export const LoginWrapper = () => {
  return (
    <div className="min-h-screen bg-[#ECECEF]">
      <div className="grid min-h-screen grid-cols-2 gap-16 p-6">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src={banner}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div
            className="absolute inset-0 opacity-25"
            style={{
              background: `linear-gradient(
                180deg,
                #010860 0%,
                #002283 19.23%,
                #734AA3 38.46%,
                #E7959C 57.21%,
                #E4A182 76.92%,
                #BF3613 100%
              )`,
            }}
          />

          <div className="relative flex h-full flex-col p-6">
            <div>
              <img
                src="/logo.svg"
                alt="Productr"
                className="h-8"
              />
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="relative w-[310px] overflow-hidden rounded-[42px] shadow-[0_30px_60px_rgba(0,0,0,0.18)]">
                <img
                  src={bannerPoster}
                  alt=""
                  className="h-[480px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                <div className="absolute bottom-10 left-1/2 w-full -translate-x-1/2 px-6 text-center">
                  <h2 className="text-xl font-semibold leading-tight text-white">
                    Uplist your
                    <br />
                    product to market
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
