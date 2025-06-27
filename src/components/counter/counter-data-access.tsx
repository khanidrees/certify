'use client'

import { getCounterProgram, getCounterProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'
import { get } from 'http'

export type createCertArgs = {
  name: string
  courseId: string
  learnerId: string
  courseName: string
}

export function useCounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCounterProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCounterProgram(provider, programId), [provider, programId])

  // const accounts = useQuery({
  //   queryKey: ['certificates', 'all', { cluster }],
  //   queryFn: () => program.account.certificate.all(
  //     // TODO: query get certificates of particular course
  //   ),
  // });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const createCertificate = useMutation<string, Error, createCertArgs>({
    mutationKey: ['create-certificate', { cluster }],
    mutationFn: async ( { 
      name,
      courseId,
      learnerId,
      courseName
     }) => {
      

      const tx = await program.methods
        .issueCertificate(
          learnerId,
          courseName,
          name,
          courseId,
        )
        .rpc();

      transactionToast(`Certificate created successfully! Transaction ID: ${tx}`);

      return tx;
    },
    onError: (error) => {
      toast.error(`Failed to create certificate: ${error.message}`);
    },
  });

  
  // Query to get all certificates by learnerId
  function useCertificatesByLearner(learnerId: string) {
    const paddedLearnerId = learnerId.padEnd(20, '\0');
    console.log(learnerId, 'learnerId in useCertificatesByLearner');
    return useQuery({
      queryKey: ['certificates', 'learner', { cluster, learnerId }],
      queryFn: async () => {
        console.log(learnerId, 'learnerId in queryFn');
        const learnerIdBytes = Buffer.from(paddedLearnerId);
        // fetch all certificate accounts where the learnerId matches
        return program.account.certificate.all(
          [
          {
            memcmp: {
              offset: 8 + 4, // 8 + 54 + 24, where 8 is the discriminator size, 54 is the courseId size, and 24 is the learnerId size
              bytes: bs58.encode(learnerIdBytes),
            },
          },
        ]
      );
      },
      enabled: !!learnerId && !!program,
    });
  }

  // use this to get the certificate account by learnerId inside of the learner profile
  // const getCertficateAccount = useQuery({
  //   queryKey: ['get-certs', { cluster , 
  //     // learnerId: 'learnerId'
  //      }],
  //   queryFn: ({learnerId}) => {
  //     const learnerIdBytes = Buffer.from(learnerId); 
  //     const learnerIdOffset = 8;
  //     const getProgramAccountsConfig = {
  //       filters: [
  //         {
  //           memcmp: {
  //           offset: learnerIdOffset,
  //           bytes: bs58.encode(learnerIdBytes),
  //           },
  //         },
  //       ],
  //     };
  //     return connection.getProgramAccounts(programId,getProgramAccountsConfig);
  //   },
  // })

  

  return {
    program,
    programId,
    // accounts,
    getProgramAccount,
    createCertificate,
    useCertificatesByLearner,
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  // const transactionToast = useTransactionToast()
  const { program, } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['counter', 'fetch', { cluster, account }],
    queryFn: () => program.account.certificate.fetch(account),
  })

  return {
    accountQuery,
  }
}
