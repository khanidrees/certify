import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import { Certify } from '../target/types/certify'

describe('certify', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Certify as Program<Certify>

  it('Issues a certificate successfully', async () => {
    const learnerId = 'learner_123'
    const courseName = 'Solana Developer Bootcamp'
    const name = 'Alice Smith'
    const courseId = 'course_999'

    // Deriving the PDA for the certificate
    const [certificatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from(learnerId), Buffer.from(courseName)],
      program.programId
    )

    await program.methods
      .issueCertificate(learnerId, courseName, name, courseId)
      .accounts({
        certificateAccount: certificatePda,
        org: payer.publicKey,
      })
      .rpc()

    // Fetch the account state and verify the values match
    const certAccount = await program.account.certificate.fetch(certificatePda)

    expect(certAccount.learnerId).toEqual(learnerId)
    expect(certAccount.courseId).toEqual(courseId)
    expect(certAccount.name).toEqual(name)
    expect(certAccount.courseName).toEqual(courseName)
    expect(certAccount.issuer.toString()).toEqual(payer.publicKey.toString())
    expect(certAccount.issueDate.toNumber()).toBeGreaterThan(0)
  })
})
