/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/pump_launchpad.json`.
 */
export type PumpLaunchpad = {
  address: "FZ2caJb5v1E6HfdEdstWKJzBieGXei6gfrZfqBq6dDZj";
  metadata: {
    name: "pumpLaunchpad";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "buy";
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "allocation";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "associatedUser";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "launch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 97, 117, 110, 99, 104];
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "tokenMint";
          address: "So11111111111111111111111111111111111111112";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "feeRecipient";
          writable: true;
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "args";
          type: {
            defined: {
              name: "buyArgs";
            };
          };
        }
      ];
    },
    {
      name: "claim";
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "allocation";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "associatedUser";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "launch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 97, 117, 110, 99, 104];
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "tokenMint";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "create";
      discriminator: [24, 30, 200, 40, 5, 28, 7, 119];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "launch";
          writable: true;
        },
        {
          name: "tokenMint";
          address: "So11111111111111111111111111111111111111112";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "args";
          type: {
            defined: {
              name: "createArgs";
            };
          };
        }
      ];
    },
    {
      name: "deposit";
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "allocation";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "launch.creator";
                account: "launch";
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "associatedUser";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "launch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 97, 117, 110, 99, 104];
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "tokenMint";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "initialize";
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
          address: "BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "sell";
      discriminator: [51, 230, 133, 164, 1, 127, 131, 173];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "allocation";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110];
              },
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "associatedUser";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "launch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 97, 117, 110, 99, 104];
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "tokenMint";
          address: "So11111111111111111111111111111111111111112";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "feeRecipient";
          writable: true;
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "args";
          type: {
            defined: {
              name: "sellArgs";
            };
          };
        }
      ];
    },
    {
      name: "setParams";
      discriminator: [27, 234, 178, 52, 147, 2, 187, 141];
      accounts: [
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "user";
          writable: true;
          signer: true;
          address: "BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "args";
          type: {
            defined: {
              name: "setParamsArgs";
            };
          };
        }
      ];
    },
    {
      name: "withdraw";
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "global";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [103, 108, 111, 98, 97, 108];
              }
            ];
          };
        },
        {
          name: "associatedUser";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "user";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "launch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [108, 97, 117, 110, 99, 104];
              },
              {
                kind: "account";
                path: "launch.id";
                account: "launch";
              }
            ];
          };
        },
        {
          name: "tokenMint";
          address: "So11111111111111111111111111111111111111112";
        },
        {
          name: "associatedLaunch";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "launch";
              },
              {
                kind: "const";
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: "account";
                path: "tokenMint";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    }
  ];
  accounts: [
    {
      name: "allocation";
      discriminator: [147, 154, 3, 177, 155, 25, 131, 176];
    },
    {
      name: "global";
      discriminator: [167, 232, 232, 177, 200, 108, 114, 127];
    },
    {
      name: "launch";
      discriminator: [144, 51, 51, 163, 206, 85, 213, 38];
    }
  ];
  events: [
    {
      name: "launchCompleted";
      discriminator: [210, 108, 183, 217, 46, 131, 150, 246];
    },
    {
      name: "tokenTraded";
      discriminator: [167, 34, 118, 88, 131, 143, 27, 240];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidUser";
      msg: "Invalid user";
    },
    {
      code: 6001;
      name: "globalNotInitialized";
      msg: "Global not initialized";
    },
    {
      code: 6002;
      name: "maxSupplyExceeded";
      msg: "Max supply exceeded";
    },
    {
      code: 6003;
      name: "arithmeticError";
      msg: "Arithmetic error";
    },
    {
      code: 6004;
      name: "insufficientFunds";
      msg: "Insufficient funds";
    },
    {
      code: 6005;
      name: "launchCompleted";
      msg: "Launch is completed";
    },
    {
      code: 6006;
      name: "launchNotCompleted";
      msg: "Launch is not completed";
    },
    {
      code: 6007;
      name: "launchWithdrawn";
      msg: "Launch is withdrawn";
    },
    {
      code: 6008;
      name: "launchNotWithdrawn";
      msg: "Launch not withdrawn";
    },
    {
      code: 6009;
      name: "launchDeposited";
      msg: "Launch is deposited";
    },
    {
      code: 6010;
      name: "launchNotDeposited";
      msg: "Launch is not deposited";
    },
    {
      code: 6011;
      name: "invalidFeeRecipient";
      msg: "Invalid fee receipient";
    }
  ];
  types: [
    {
      name: "allocation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "bool";
          },
          {
            name: "id";
            type: "u32";
          },
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "tokenAmount";
            type: "u64";
          },
          {
            name: "claimed";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "buyArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tokenAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "createArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          }
        ];
      };
    },
    {
      name: "global";
      type: {
        kind: "struct";
        fields: [
          {
            name: "initialized";
            type: "bool";
          },
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "feeRecipient";
            type: "pubkey";
          },
          {
            name: "feeBasisPoints";
            type: "u16";
          },
          {
            name: "tokens";
            type: "u32";
          },
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "creatorSupply";
            type: "u64";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "launch";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u32";
          },
          {
            name: "mint";
            type: "pubkey";
          },
          {
            name: "creator";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "soldSupply";
            type: "u64";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "feeCollected";
            type: "u64";
          },
          {
            name: "completed";
            type: "bool";
          },
          {
            name: "withdrawn";
            type: "bool";
          },
          {
            name: "deposited";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "launchCompleted";
      type: {
        kind: "struct";
        fields: [
          {
            name: "id";
            type: "u32";
          },
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "creatorSupply";
            type: "u64";
          },
          {
            name: "price";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "sellArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "tokenAmount";
            type: "u64";
          }
        ];
      };
    },
    {
      name: "setParamsArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "feeRecipient";
            type: "pubkey";
          },
          {
            name: "feeBasisPoints";
            type: "u16";
          },
          {
            name: "maxSupply";
            type: "u64";
          },
          {
            name: "creatorSupply";
            type: "u64";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "initialized";
            type: "bool";
          }
        ];
      };
    },
    {
      name: "tokenTraded";
      type: {
        kind: "struct";
        fields: [
          {
            name: "isBuy";
            type: "bool";
          },
          {
            name: "id";
            type: "u32";
          },
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "tokenAmount";
            type: "u64";
          },
          {
            name: "soldSupply";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: PumpLaunchpad = {
  address: "FZ2caJb5v1E6HfdEdstWKJzBieGXei6gfrZfqBq6dDZj",
  metadata: {
    name: "pumpLaunchpad",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "buy",
      discriminator: [102, 6, 61, 18, 1, 218, 235, 234],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "allocation",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110],
              },
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "associatedUser",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "launch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 97, 117, 110, 99, 104],
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "tokenMint",
          address: "So11111111111111111111111111111111111111112",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "feeRecipient",
          writable: true,
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "buyArgs",
            },
          },
        },
      ],
    },
    {
      name: "claim",
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "allocation",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110],
              },
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "associatedUser",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "launch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 97, 117, 110, 99, 104],
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "tokenMint",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "create",
      discriminator: [24, 30, 200, 40, 5, 28, 7, 119],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "launch",
          writable: true,
        },
        {
          name: "tokenMint",
          address: "So11111111111111111111111111111111111111112",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "createArgs",
            },
          },
        },
      ],
    },
    {
      name: "deposit",
      discriminator: [242, 35, 198, 137, 82, 225, 242, 182],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "allocation",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110],
              },
              {
                kind: "account",
                path: "launch.creator",
                account: "launch",
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "associatedUser",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "launch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 97, 117, 110, 99, 104],
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "tokenMint",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "initialize",
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237],
      accounts: [
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
          address: "BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
    {
      name: "sell",
      discriminator: [51, 230, 133, 164, 1, 127, 131, 173],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "allocation",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [97, 108, 108, 111, 99, 97, 116, 105, 111, 110],
              },
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "associatedUser",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "launch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 97, 117, 110, 99, 104],
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "tokenMint",
          address: "So11111111111111111111111111111111111111112",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "feeRecipient",
          writable: true,
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "sellArgs",
            },
          },
        },
      ],
    },
    {
      name: "setParams",
      discriminator: [27, 234, 178, 52, 147, 2, 187, 141],
      accounts: [
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "user",
          writable: true,
          signer: true,
          address: "BjjFpCbTrFVn3ZgcdCv4jTLAzbbDCMV1Vo115XJSJ7XG",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [
        {
          name: "args",
          type: {
            defined: {
              name: "setParamsArgs",
            },
          },
        },
      ],
    },
    {
      name: "withdraw",
      discriminator: [183, 18, 70, 156, 148, 109, 161, 34],
      accounts: [
        {
          name: "user",
          writable: true,
          signer: true,
        },
        {
          name: "global",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [103, 108, 111, 98, 97, 108],
              },
            ],
          },
        },
        {
          name: "associatedUser",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "user",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "launch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "const",
                value: [108, 97, 117, 110, 99, 104],
              },
              {
                kind: "account",
                path: "launch.id",
                account: "launch",
              },
            ],
          },
        },
        {
          name: "tokenMint",
          address: "So11111111111111111111111111111111111111112",
        },
        {
          name: "associatedLaunch",
          writable: true,
          pda: {
            seeds: [
              {
                kind: "account",
                path: "launch",
              },
              {
                kind: "const",
                value: [
                  6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206,
                  235, 121, 172, 28, 180, 133, 237, 95, 91, 55, 145, 58, 140,
                  245, 133, 126, 255, 0, 169,
                ],
              },
              {
                kind: "account",
                path: "tokenMint",
              },
            ],
            program: {
              kind: "const",
              value: [
                140, 151, 37, 143, 78, 36, 137, 241, 187, 61, 16, 41, 20, 142,
                13, 131, 11, 90, 19, 153, 218, 255, 16, 132, 4, 142, 123, 216,
                219, 233, 248, 89,
              ],
            },
          },
        },
        {
          name: "associatedTokenProgram",
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
        },
        {
          name: "tokenProgram",
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        },
        {
          name: "systemProgram",
          address: "11111111111111111111111111111111",
        },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "allocation",
      discriminator: [147, 154, 3, 177, 155, 25, 131, 176],
    },
    {
      name: "global",
      discriminator: [167, 232, 232, 177, 200, 108, 114, 127],
    },
    {
      name: "launch",
      discriminator: [144, 51, 51, 163, 206, 85, 213, 38],
    },
  ],
  events: [
    {
      name: "launchCompleted",
      discriminator: [210, 108, 183, 217, 46, 131, 150, 246],
    },
    {
      name: "tokenTraded",
      discriminator: [167, 34, 118, 88, 131, 143, 27, 240],
    },
  ],
  errors: [
    {
      code: 6000,
      name: "invalidUser",
      msg: "Invalid user",
    },
    {
      code: 6001,
      name: "globalNotInitialized",
      msg: "Global not initialized",
    },
    {
      code: 6002,
      name: "maxSupplyExceeded",
      msg: "Max supply exceeded",
    },
    {
      code: 6003,
      name: "arithmeticError",
      msg: "Arithmetic error",
    },
    {
      code: 6004,
      name: "insufficientFunds",
      msg: "Insufficient funds",
    },
    {
      code: 6005,
      name: "launchCompleted",
      msg: "Launch is completed",
    },
    {
      code: 6006,
      name: "launchNotCompleted",
      msg: "Launch is not completed",
    },
    {
      code: 6007,
      name: "launchWithdrawn",
      msg: "Launch is withdrawn",
    },
    {
      code: 6008,
      name: "launchNotWithdrawn",
      msg: "Launch not withdrawn",
    },
    {
      code: 6009,
      name: "launchDeposited",
      msg: "Launch is deposited",
    },
    {
      code: 6010,
      name: "launchNotDeposited",
      msg: "Launch is not deposited",
    },
    {
      code: 6011,
      name: "invalidFeeRecipient",
      msg: "Invalid fee receipient",
    },
  ],
  types: [
    {
      name: "allocation",
      type: {
        kind: "struct",
        fields: [
          {
            name: "initialized",
            type: "bool",
          },
          {
            name: "id",
            type: "u32",
          },
          {
            name: "user",
            type: "pubkey",
          },
          {
            name: "tokenAmount",
            type: "u64",
          },
          {
            name: "claimed",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "buyArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tokenAmount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "createArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
        ],
      },
    },
    {
      name: "global",
      type: {
        kind: "struct",
        fields: [
          {
            name: "initialized",
            type: "bool",
          },
          {
            name: "authority",
            type: "pubkey",
          },
          {
            name: "feeRecipient",
            type: "pubkey",
          },
          {
            name: "feeBasisPoints",
            type: "u16",
          },
          {
            name: "tokens",
            type: "u32",
          },
          {
            name: "maxSupply",
            type: "u64",
          },
          {
            name: "creatorSupply",
            type: "u64",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "launch",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u32",
          },
          {
            name: "mint",
            type: "pubkey",
          },
          {
            name: "creator",
            type: "pubkey",
          },
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "maxSupply",
            type: "u64",
          },
          {
            name: "soldSupply",
            type: "u64",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "feeCollected",
            type: "u64",
          },
          {
            name: "completed",
            type: "bool",
          },
          {
            name: "withdrawn",
            type: "bool",
          },
          {
            name: "deposited",
            type: "bool",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "launchCompleted",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "u32",
          },
          {
            name: "maxSupply",
            type: "u64",
          },
          {
            name: "creatorSupply",
            type: "u64",
          },
          {
            name: "price",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "sellArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "tokenAmount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "setParamsArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "pubkey",
          },
          {
            name: "feeRecipient",
            type: "pubkey",
          },
          {
            name: "feeBasisPoints",
            type: "u16",
          },
          {
            name: "maxSupply",
            type: "u64",
          },
          {
            name: "creatorSupply",
            type: "u64",
          },
          {
            name: "price",
            type: "u64",
          },
          {
            name: "initialized",
            type: "bool",
          },
        ],
      },
    },
    {
      name: "tokenTraded",
      type: {
        kind: "struct",
        fields: [
          {
            name: "isBuy",
            type: "bool",
          },
          {
            name: "id",
            type: "u32",
          },
          {
            name: "user",
            type: "pubkey",
          },
          {
            name: "tokenAmount",
            type: "u64",
          },
          {
            name: "soldSupply",
            type: "u64",
          },
        ],
      },
    },
  ],
};
