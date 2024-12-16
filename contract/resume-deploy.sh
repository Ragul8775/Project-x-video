#!/usr/bin/expect

# Ask the user to input the seed phrase
puts "Please enter your seed phrase:"
expect_user -re "(.*)\n"
set seed_phrase $expect_out(1,string)

set timeout -1

# First command: solana-keygen recover
spawn solana-keygen recover -o ./target/recover.json

# First interaction: Provide the seed phrase
expect "seed phrase:"
send -- "$seed_phrase\r"

# Second interaction: Enter the passphrase or press ENTER to skip
expect "enter it now. Otherwise, press ENTER to continue:"
send -- "\r"

# Third interaction: Confirmation (y/n)
expect "Continue? (y/n):"
send -- "y\r"

expect eof

# After the interactive session finishes, switch back to the shell to run the remaining commands.
# Now, execute the deployment command outside of the expect block.
# This can be done using the `system` command from expect to run shell commands.

puts "Running solana program deploy..."
system "solana program deploy --buffer ./target/recover.json --upgrade-authority /home/alwin-helor/.config/solana/id.json --program-id target/deploy/pump_launchpad-keypair.json target/deploy/pump_launchpad.so --with-compute-unit-price 100000"

# Remove the recover.json file after deployment
puts "Removing recover.json file..."
system "rm ./target/recover.json"
