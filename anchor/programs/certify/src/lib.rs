#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("8Wsmf8Sb8hvTwRPNJL3VEaLS3gyWey27Lv1PcqmtqFkc");

#[program]
pub mod certify {
    use super::*;

    pub fn issue_certificate(
        ctx: Context<IssueCertificate>,
        learner_id: String,
        course_name: String,
        name: String,
        course_id: String,
    ) -> Result<()> {

        // log::
        msg!(
            "Issuing certificate for learner: {}, course: {}, issued by: {}",
            name, course_name, ctx.accounts.org.key()
        );

        
        
        let certificate_account = &mut ctx.accounts.certificate_account;
        certificate_account.name = name;
        certificate_account.course_id = course_id;
        certificate_account.learner_id = learner_id;
        certificate_account.issue_date = Clock::get().unwrap().unix_timestamp as u64;
        certificate_account.course_name = course_name;
        certificate_account.issuer = ctx.accounts.org.key();
        
        msg!("Learner ID: {}", certificate_account.learner_id);
        msg!("Course ID: {}", certificate_account.course_id);
        msg!("Issuer: {}", ctx.accounts.org.key());
        msg!("Issue Date: {}", certificate_account.issue_date);
        msg!("Certificate Name: {}", certificate_account.name);
        msg!("Course Name: {}", certificate_account.course_name);

        Ok(())
    }

    // // verify certificate that it exists on chain
    // pub fn verify_certificate(ctx: Context<IssueCertificate>) -> Result<()> {
    //     Ok(())
    // }
    

}



#[derive(Accounts)]
#[instruction( learner_id: String, course_name: String)]
pub struct IssueCertificate<'info> {
    
    #[account(
        init,
        payer = org,
        space = 8 + Certificate::INIT_SPACE,
        seeds = [learner_id.as_bytes(), course_name.as_bytes()],
        bump
    )]
    pub certificate_account: Account<'info, Certificate>,
    
    #[account(mut)]
    pub org: Signer<'info>,

    
    pub system_program: Program<'info, System>,
}







#[account]
#[derive(InitSpace)]
pub struct Certificate {
    #[max_len(20)]
    pub learner_id: String,
    #[max_len(50)]
    pub name: String,
    #[max_len(20)]
    pub course_id: String,
    #[max_len(50)]
    pub course_name: String,
    pub issue_date: u64,
    pub issuer: Pubkey,
}




