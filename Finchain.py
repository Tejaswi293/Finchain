import smartpy as sp

class DynamicNFT(sp.Contract):
    def __init__(self, admin, initial_value):
        self.init(owner=admin, value=initial_value)

    @sp.entry_point
    def update_value(self, new_value):
        sp.verify(sp.sender == self.data.owner, "Only the owner can update value")
        self.data.value = new_value

    @sp.entry_point
    def transfer_ownership(self, new_owner):
        sp.verify(sp.sender == self.data.owner, "Only the owner can transfer")
        self.data.owner = new_owner

@sp.add_test(name = "DynamicNFT Test")
def test():
    admin = sp.test_account("Admin")
    user = sp.test_account("User")

    contract = DynamicNFT(admin.address, initial_value=100)
    scenario = sp.test_scenario()
    scenario += contract

    # Test value update
    contract.update_value(200).run(sender=admin)
    # Test ownership transfer
    contract.transfer_ownership(user.address).run(sender=admin)
