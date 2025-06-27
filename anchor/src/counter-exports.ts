// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CounterIDL from '../target/idl/certify.json'
import { Certify } from 'anchor/target/types/certify'

// Re-export the generated IDL and type
// export { Certify, CounterIDL }

// The programId is imported from the program IDL.
export const COUNTER_PROGRAM_ID = new PublicKey(CounterIDL.address)

// This is a helper function to get the Certify Anchor program.
export function getCounterProgram(provider: AnchorProvider, address?: PublicKey): Program<Certify> {
  return new Program({ ...CounterIDL, address: address ? address.toBase58() : CounterIDL.address } as Certify, provider)
}

// This is a helper function to get the program ID for the Certify program depending on the cluster.
export function getCounterProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Certify program on devnet and testnet.
      return new PublicKey('8Wsmf8Sb8hvTwRPNJL3VEaLS3gyWey27Lv1PcqmtqFkc')
    case 'mainnet-beta':
    default:
      return COUNTER_PROGRAM_ID
  }
}
