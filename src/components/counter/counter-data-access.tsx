'use client'

import { getCounterProgram, getCounterProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes'

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

  return {
    program,
    programId,
    // accounts,
    getProgramAccount,
    createCertificate,
  }
}

export function useCertificateByCourseIdLearnerId(courseId: string, learnerId: string) {
  const { program } = useCounterProgram()
  const { cluster } = useCluster()

  return useQuery({
    queryKey: ['certificates', 'learner', { cluster, courseId, learnerId }],
    queryFn: async () => {
      const learnerIdBytes = Buffer.from(learnerId);
      const courseIdBytes = Buffer.from(courseId);
      return program.account.certificate.all([
        {
          memcmp: {
            offset: 8,
            bytes: bs58.encode(Buffer.concat([
              Buffer.from([learnerId.length, 0, 0, 0]),
              learnerIdBytes
            ])),
          }
        },
        {
          memcmp: {
            offset: 8 + 4 + learnerId.length,
            bytes: bs58.encode(Buffer.concat([
              Buffer.from([courseId.length, 0, 0, 0]),
              courseIdBytes
            ])),
          }
        },
      ]);
    },
    enabled: !!learnerId && !!courseId && !!program,
  });
}

export function useCertificatesByLearner(learnerId: string) {
  const { program } = useCounterProgram()
  const { cluster } = useCluster()
  const paddedLearnerId = learnerId.padEnd(20, '\0');

  return useQuery({
    queryKey: ['certificates', 'learner', { cluster, learnerId }],
    queryFn: async () => {
      const learnerIdBytes = Buffer.from(paddedLearnerId);
      return program.account.certificate.all([
        {
          memcmp: {
            offset: 8 + 4,
            bytes: bs58.encode(learnerIdBytes),
          },
        },
      ]);
    },
    enabled: !!learnerId && !!program,
  });
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
