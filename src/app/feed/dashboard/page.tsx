'use client'
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useState, useContext, useRef } from "react";
import { useRouter } from 'next/navigation';
import { UserContext } from "@/app/context/UserContext";
import ToolsMenu from "@/app/components/ToolsMenu";


export default function Home() {
  const [dashboard, setDashboard] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter();
  const _userContext = useContext(UserContext)
  const optionsToolsMenu: any = []

  /*const goRouter = (href: string) => {
    router.push(href)
  }*/

  const getDashboardFetch = async () => {
    try {
      const url = new URL('https://backend-my-site.onrender.com/config/dashboard');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json', // Tipo de conteúdo que você está enviando
          'Authorization': `Bearer ${_userContext?.token}`,
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao enviar requisição.');
      }

      const responseData = await response.json();
      if(responseData.status !== 0) {
        setDashboard(responseData.datas)
      }
      setLoading(false)
      //console.log('Resposta da API:', responseData);
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
    }
  };

  useEffect(() => {
    getDashboardFetch()
  }, [])

  return (
    <main className="flex w-full p-4">
      <div className="grid grid-cols-1 w-full">

        <div className="col-span-1 bg-white shadow-lg rounded p-2">
          <div className="flex items-center justify-between">
            <Breadcrumb spacing='4px' separator={<ChevronRightIcon w={5} h={5} color='black' />}>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink color="black">Regras</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex items-center">
              <ToolsMenu options={optionsToolsMenu} />
            </div>
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <h1 className="mb-0 text-xl lg:text-2xl">Dashboard</h1>
        </div>

        <div className="col-span-1 mt-4 bg-white shadow-lg rounded p-3">
            {
              dashboard.length > 0 ?
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:gris-cols-4 gap-2 lg:gap-4">
                {
                  dashboard.map((data: any, index: any) => (
                    <div key={index} className="col-span-1 bg-neutral-700 text-white p-3 rounded">
                      <div className="grid grid-cols-1">
                        <div className="col-span-1">
                          <Stat>
                            <StatLabel>
                              <span className="text-lg font-[700px]">{data.label}</span>
                            </StatLabel>
                            <StatNumber>
                              <span className="text-4xl font-weight-bold">{data.count}</span>
                            </StatNumber>
                            <StatHelpText>
                              <div className="flex items-center">
                                {
                                  data.percentageIncrease > 0 && <StatArrow type='increase' />
                                }
                                <span>{data.percentageIncrease}%</span>
                                <span className="text-[0.8rem] ml-2">( {data.countLastMonth} um mês antes )</span>
                              </div>
                            </StatHelpText>
                          </Stat>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              
              : <></>
            }
        </div>
      </div>
    </main>
  );
}
