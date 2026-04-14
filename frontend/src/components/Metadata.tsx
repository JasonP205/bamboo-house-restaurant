import {Helmet} from "react-helmet-async";
import { formatTitle } from "@/lib/utils";
interface MetadataProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}
const Metadata = ({ title, description, ogTitle, ogDescription, ogImage }: MetadataProps) => {
  return (
    <Helmet>
      {title ? <title>{formatTitle(title)}</title> : <title>Bamboo House</title>}
      {description ? <meta name="description" content={description} /> : <meta name="description" content="Bamboo House" />}
      {ogTitle ? <meta property="og:title" content={ogTitle} /> : <meta property="og:title" content="Bamboo House" />}
      {ogDescription ? <meta property="og:description" content={ogDescription} /> : <meta property="og:description" content="Bamboo House" />}
      {ogImage ? <meta property="og:image" content={ogImage} /> : <meta property="og:image" content="/indoor.png" />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta name="author" content="Phan Hoàng Phúc" />
    </Helmet>
  )
}

export default Metadata