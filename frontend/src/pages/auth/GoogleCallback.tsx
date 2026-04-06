import { useAuthStore } from "../../stores/useAuthStore";
import { Navigate, useSearchParams } from "react-router-dom";
import { Spinner, Card, Avatar } from "@heroui/react";
import { useEffect } from "react";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const m = searchParams.get("m");
  const a = searchParams.get("a");
  const decodedMail = decodeURIComponent(m || "");
  const decodedAvatar = decodeURIComponent(a || "");
  console.log("Decoded mail:", decodedMail);
  console.log("Decoded avatar:", decodedAvatar);
  const { fetchMe, loading, user } = useAuthStore();
  useEffect(() => {
      const handleGoogleCallback = async () => {
          try {
              await fetchMe();
          } catch (error) {
              console.error("Error handling Google callback:", error);
          }
      };

      handleGoogleCallback();
  }, [fetchMe]);

  if (loading) {
    return (
      <div className="relative w-full h-screen flex flex-col items-center justify-center gap-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[url('/img/screen.png')] bg-cover bg-center bg-no-repeat"></div>

        {/* Overlay tối nhẹ */}
        <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Spinner size="lg" />

          <Card className="rounded-full px-5 py-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <div className="flex items-center gap-3">
              {decodedAvatar && (
                <Avatar size="md">
                  <Avatar.Image src={decodedAvatar} />
                  <Avatar.Fallback>BH</Avatar.Fallback>
                </Avatar>
              )}

              {decodedMail && (
                <div className="flex flex-col">
                  <span className="uppercase text-[10px] tracking-widest text-muted/70">
                    login as
                  </span>
                  <p className="text-accent font-semibold">{decodedMail}</p>
                </div>
              )}
            </div>
          </Card>

          <p className="text-muted/70 text-sm italic tracking-wide">
            Bamboo House — EST 2012
          </p>
        </div>
      </div>
    );
  }
  if (user) return <Navigate to="/app/orders/place-order" />;
};

export default GoogleCallback;
