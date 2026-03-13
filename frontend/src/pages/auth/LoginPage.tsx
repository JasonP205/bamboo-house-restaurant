import { Helmet } from "react-helmet-async";
import { Tabs } from "@heroui/react";
import { useState } from "react";

import CustomerLoginForm from "@/components/auth/CustomerLoginForm";
import StaffLoginForm from "@/components/auth/StaffLoginForm";

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState<any>("Customer");
  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <Helmet>
        <title>Login - Bamboo House Restaurant</title>
        <meta
          name="description"
          content="Login to your Bamboo House account to manage your reservations, view your order history, and more!"
        />
        <meta
          name="keywords"
          content="Bamboo House, restaurant, login, customer login, staff login, reservations, order history"
        />
        <meta name="author" content="Bamboo House Team" />
        <meta property="og:title" content="Login - Bamboo House Restaurant" />
        <meta
          property="og:description"
          content="Login to your Bamboo House account to manage your reservations, view your order history, and more!"
        />
        <meta property="og:image" content="/bamboo-house-icon.png" />
        <meta
          property="og:url"
          content="https://www.bamboohouse.com/auth/login"
        />
      </Helmet>
      <div className="bg-login"></div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl bg-background/60 border-none overflow-hidden rounded-xl shadow-xl backdrop-blur-sm">
          <div className="flex w-full">
            {/* Left Image */}
            <div className="relative hidden md:block md:w-1/2">
              <img
                src="/indoor.png"
                alt="Login Background"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Right Login Form */}
            <div className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8">
              <div className="mb-6 flex flex-col items-center gap-2">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src="/bamboo-house-icon.png"
                    alt="Bamboo House Logo"
                    className="size-10 rounded-md"
                  />
                  <h2 className="font-playfair text-center text-3xl text-accent">
                    Bamboo House
                  </h2>
                </div>

                <p className="text-center text-muted text-xs md:text-sm leading-relaxed text-balance">
                  {activeTab === "Customer"
                    ? "Hungry for more? Log in to explore our latest dishes and offers."
                    : "Welcome back to the team! Let's make today a great one at Bamboo House."}
                </p>
              </div>

              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key)}
                className="mt-4 w-full"
              >
                <Tabs.ListContainer>
                  <Tabs.List
                    aria-label="Login type"
                    className="bg-background/50 backdrop-blur-md"
                  >
                    <Tabs.Tab id="Customer">
                      Customer
                      <Tabs.Indicator />
                    </Tabs.Tab>

                    <Tabs.Tab id="Staff">
                      Staff
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel id="Customer" className="pt-4">
                  <CustomerLoginForm />
                </Tabs.Panel>

                <Tabs.Panel id="Staff" className="pt-4">
                  <StaffLoginForm />
                </Tabs.Panel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
