'use client'
import { useSelector } from 'react-redux';
import Link from "next/link";
import { styled } from "@mui/material/styles";
import Image from "next/image";

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);
  return (
    <a href="/"><img src="/images/logos/logo-afrik-ticket.webp" width={250} alt="Logo" fetchPriority="high" /></a>
  );
};

export default Logo;
