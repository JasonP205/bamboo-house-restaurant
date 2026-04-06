import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CustomerRegisterForm from "@/components/auth/CustomerRegisterForm";
import ToggleTheme from "@/components/ui/toggleTheme";
import ToggleLang from "@/components/ui/toggleLang";

const RegisterPage = () => {
  const { t } = useTranslation("auth");
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Helmet>
        <title>{t("tabTitle.register")}</title>
        <meta
          name="description"
          content="Register for a Bamboo House account to manage your reservations, view your order history, and more!"
        />
        <meta
          name="keywords"
          content="Bamboo House, restaurant, register, customer register, staff register, reservations, order history"
        />
        <meta name="author" content="Bamboo House Team" />
        <meta
          property="og:title"
          content="Register - Bamboo House Restaurant"
        />
        <meta
          property="og:description"
          content="Register for a Bamboo House account to manage your reservations, view your order history, and more!"
        />
        <meta property="og:image" content="/bamboo-house-icon.png" />
        <meta
          property="og:url"
          content="https://www.bamboohouse.com/auth/register"
        />
      </Helmet>
      <div className="flex gap-2 absolute top-4 right-4">
        <ToggleTheme />
        <ToggleLang />
      </div>
      <div className="bg-login"></div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl bg-background/60 border-none overflow-hidden rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex w-full">
            {/* Left Image */}
            <div className="relative hidden md:block md:w-1/2">
              <img
                src="/img/indoor.png"
                alt="Login Background"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Right Register Form */}
            <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8">
              <div className="mb-6 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src="/img/bamboo-house-icon.png"
                    alt="Bamboo House Logo"
                    className="size-10 rounded-md"
                  />
                  <h2 className="font-playfair text-center text-3xl text-accent">
                    Bamboo House
                  </h2>
                </div>

                <p className="text-center text-muted text-xs md:text-sm leading-relaxed text-balance">
                  {t("greeting.register.customer")}
                </p>
              </div>

              <CustomerRegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
