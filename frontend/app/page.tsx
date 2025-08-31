'use client'

import UrlForm from "@/components/UrlForm";
import { LocalLink } from "@/lib/api";
import { useState } from "react";

export default function Home() {
  const [links, setLinks] = useState<LocalLink[]>([]);
  
  const handleLinkCreated = (link: LocalLink) => {
    setLinks(prev => [link, ...prev])
  }
  return (
    <div>
      <UrlForm onLinkCreated={handleLinkCreated}/>
    </div>
  )
}