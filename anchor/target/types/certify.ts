/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/certify.json`.
 */
export type Certify = {
  "address": "8Wsmf8Sb8hvTwRPNJL3VEaLS3gyWey27Lv1PcqmtqFkc",
  "metadata": {
    "name": "certify",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "issueCertificate",
      "discriminator": [
        61,
        197,
        55,
        28,
        159,
        18,
        132,
        128
      ],
      "accounts": [
        {
          "name": "certificateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "learnerId"
              },
              {
                "kind": "arg",
                "path": "courseName"
              }
            ]
          }
        },
        {
          "name": "org",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "learnerId",
          "type": "string"
        },
        {
          "name": "courseName",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "courseId",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "certificate",
      "discriminator": [
        202,
        229,
        222,
        220,
        116,
        20,
        74,
        67
      ]
    }
  ],
  "types": [
    {
      "name": "certificate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "learnerId",
            "type": "string"
          },
          {
            "name": "courseId",
            "type": "string"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "courseName",
            "type": "string"
          },
          {
            "name": "issueDate",
            "type": "u64"
          },
          {
            "name": "issuer",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
