<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-2">
      <CDropdownItem @click="logout()">
        <CIcon icon="cil-lock-locked" /> Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import { signOut } from '@/plugins/auth'
export default {
  name: 'AppHeaderDropdownAccnt',
  data() {
    return {
      avatar:
        'https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg',
      itemsCount: 42,
    }
  },
  methods: {
    logout() {
      signOut()
      this.$router.push({ name: 'Login' })
    },
  },
}
</script>
