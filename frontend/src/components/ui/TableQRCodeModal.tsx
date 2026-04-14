import { QRCodeCanvas } from "qrcode.react";
import { Button, Modal, Spinner } from "@heroui/react";
import { toPng } from "html-to-image";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";

interface TableQRCodeModalProps {
  tableId: string;
  branchId: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}
const TableQRCodeModal = ({
  tableId,
  branchId,
  children,
  className,
  title,
}: TableQRCodeModalProps) => {
  const qrValue = `${import.meta.env.VITE_APPLICATION_URL}/order?t=${tableId}&b=${branchId}`;
  const [creatingImage, setCreatingImage] = useState(false);
  const { t } = useTranslation(["common"]);
  const qrRef = useRef<HTMLDivElement>(null);
  const handleDownload = () => {
    setCreatingImage(true);
    const qrElement = document.getElementById(`qr-${tableId}`);
    if (qrElement) {
      toPng(qrElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `table-${tableId}-qr-code.png`;
          link.href = dataUrl;
          link.click();
          setCreatingImage(false);
        })
        .catch((err) => {
          console.error("Failed to download QR code:", err);
          setCreatingImage(false);
        });
    }
  };
  return (
    <Modal>
      <Modal.Trigger className={className}>{children}</Modal.Trigger>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title || "Table QR Code"}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div
                ref={qrRef}
                className="p-6 bg-white rounded-xl flex flex-col items-center justify-center gap-2 print:p-0 print:bg-white"
              >
                <QRCodeCanvas
                  id={`qr-${tableId}`}
                  value={qrValue}
                  level="H"
                  size={220}
                  fgColor="#14422d"
                  className="rounded-xl"
                  bgColor="#ffffff" // ⚠️ đổi thành trắng cho in
                  includeMargin={true}
                  marginSize={4}
                  imageSettings={{
                    src: "/img/bamboo-house-icon.png",
                    height: 42,
                    width: 42,
                    excavate: true,
                  }}
                />
                <a href={qrValue} target="_blank" rel="noopener noreferrer" className="text-sm text-muted break-all">
                  {qrValue}
                </a>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline">
                {t("table.printButton")}
              </Button>
              <Button onClick={handleDownload} isPending={creatingImage}>
                {creatingImage ? (
                  <>
                    <Spinner className="text-muted" size="sm" />{" "}
                    {t("table.preparing")}
                  </>
                ) : (
                  t("table.downloadButton")
                )}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default TableQRCodeModal;
