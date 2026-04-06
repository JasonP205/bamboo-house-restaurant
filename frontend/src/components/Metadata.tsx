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
      {title && <title>{formatTitle(title)}</title>}
      {description && <meta name="description" content={description} />}
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogDescription && <meta property="og:description" content={ogDescription} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
    </Helmet>
  )
}

export default Metadata