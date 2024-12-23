'use client'
import { Button } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const goRouter = (url: string) => {
		router.push(url);
	}

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full bg-red-900 items-center justify-between font-mono text-sm lg:flex p-4">
        <p>Oi, teste</p>
        <Button onClick={() => goRouter('/feed/meu-perfil')} colorScheme='teal' size='sm'>
          Button
        </Button>
      </div>
    </main>
  );
}
