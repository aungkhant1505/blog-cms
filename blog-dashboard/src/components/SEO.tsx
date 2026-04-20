import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description: string;
    type?: string;
}

export default function SEO({ title, description, type = "website"}: SEOProps) {

    const siteName = "My Blog CMS"; 
    return (
        <Helmet>
            {/* Standard SEO */}
            <title>{`${title}`}</title>
            <meta name="description" content={description} />

            {/* Open Graph (Facebook, LinkedIn, iMessage links) */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
        </Helmet>

    )
}