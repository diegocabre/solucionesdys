import Link from "next/link";

export const NavBar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/productos">Productos</Link>
        </li>
        <li>
          <Link href="/contacto">Contacto</Link>
        </li>
      </ul>
    </nav>
  );
};
