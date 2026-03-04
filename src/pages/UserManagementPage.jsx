import React from "react";
const _jsxFileName = "src\\pages\\UserManagementPage.tsx";import { useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { AdminHeader } from '@/components/AdminHeader';
import { UserStatusChip, RoleBadge } from '@/components/StatusChip';
import {
  dummyAdminUsers,
  dummyPermissionMatrix,
  formatDateTime,
  formatShortId,
} from '@/data/dummyData';
import {
  Search,
  Plus,
  Edit,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Key,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [permissions, setPermissions] = useState(
    () => dummyPermissionMatrix.map((row) => ({ ...row }))
  );

  // Filter users
  const filteredUsers = dummyAdminUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: dummyAdminUsers.length,
    active: dummyAdminUsers.filter((u) => u.status === 'active').length,
    disabled: dummyAdminUsers.filter((u) => u.status === 'disabled').length,
  };

  const openEdit = (user) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handlePermissionToggle = (index, key, checked) => {
    setPermissions((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: Boolean(checked),
            }
          : item,
      ),
    );
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    React.createElement(AdminLayout, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
      , React.createElement(AdminHeader, {
        title: "Kelola Tim" ,
        subtitle: "Kelola akun pengguna dan izin peran"     ,
        showSearch: false,
        showDateFilter: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
      )

      , React.createElement('div', { className: "flex-1 overflow-auto p-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
        /* Stats */
        , React.createElement('div', { className: "grid grid-cols-3 gap-4 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
                , React.createElement('p', { className: "text-2xl font-bold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, stats.total)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}, "Total Pengguna" )
              )
              , React.createElement(Shield, { className: "w-8 h-8 text-primary/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}} )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}
                , React.createElement('p', { className: "text-2xl font-bold text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}, stats.active)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, "Aktif")
              )
              , React.createElement(UserCheck, { className: "w-8 h-8 text-status-approved/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}} )
            )
          )
          , React.createElement(Card, { className: "card-ocean p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
              , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}
                , React.createElement('p', { className: "text-2xl font-bold text-status-rejected"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 116}}, stats.disabled)
                , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}, "Nonaktif")
              )
              , React.createElement(UserX, { className: "w-8 h-8 text-status-rejected/30"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} )
            )
          )
        )

        /* Search & Actions */
        , React.createElement('div', { className: "mb-4 flex flex-col gap-3 lg:flex-row lg:items-center"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
          , React.createElement('div', { className: "relative w-full lg:w-[28rem]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}} )
            , React.createElement(Input, {
              placeholder: "Cari nama atau email..."   ,
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: "pl-9 bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
            )
          )
          , React.createElement('div', { className: "flex flex-wrap items-center gap-3 lg:ml-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
            , React.createElement(Select, { value: roleFilter, onValueChange: setRoleFilter, __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
              , React.createElement(SelectTrigger, { className: "w-[180px] bg-card" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                , React.createElement(SelectValue, { placeholder: "Peran", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}} )
              )
              , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}
                , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}, "Semua Peran" )
                , React.createElement(SelectItem, { value: "admin_utama", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}, "Admin Utama")
                , React.createElement(SelectItem, { value: "admin_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 142}}, "Admin Tiket" )
                , React.createElement(SelectItem, { value: "petugas_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}, "Petugas Tiket" )
              )
            )
            , React.createElement(Button, { className: "btn-ocean gap-2" , onClick: () => setShowAddDialog(true), __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
              , React.createElement(Plus, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}} ), "Tambah Pengguna"
            )
          )
        )

        /* User Table */
        , React.createElement(Card, { className: "card-ocean overflow-hidden" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
          , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
            , React.createElement('table', { className: "data-table", __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
              , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
                , React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 158}}, "Pengguna")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}, "Email")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "Peran")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "Status")
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 162}}, "Login Terakhir" )
                  , React.createElement('th', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}, "Dibuat Pada" )
                  , React.createElement('th', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}, "Aksi")
                )
              )
              , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}
                , filteredUsers.map((user) => (
                  React.createElement('tr', { key: user.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
                      , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
                        , React.createElement(Avatar, { className: "h-9 w-9" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}
                          , React.createElement(AvatarFallback, { className: "bg-primary/10 text-primary text-xs font-semibold"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                            , getInitials(user.name)
                          )
                        )
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                          , React.createElement('p', { className: "text-sm font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, user.name)
                          , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}, formatShortId(user.id))
                        )
                      )
                    )
                    , React.createElement('td', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}}, user.email)
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}
                      , React.createElement(RoleBadge, { role: user.role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 185}} )
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
                      , React.createElement(UserStatusChip, { status: user.status, __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}} )
                    )
                    , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}
                      , formatDateTime(user.lastLogin)
                    )
                    , React.createElement('td', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
                      , formatDateTime(user.createdAt)
                    )
                    , React.createElement('td', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                      , React.createElement('div', { className: "flex items-center justify-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
                        , React.createElement(DropdownMenu, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                          , React.createElement(DropdownMenuTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
                            , React.createElement(Button, { variant: "ghost", size: "icon", className: "h-8 w-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}
                              , React.createElement(MoreHorizontal, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 201}} )
                            )
                          )
                          , React.createElement(DropdownMenuContent, { align: "end", className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
                            , React.createElement(DropdownMenuItem, {
                              className: "gap-2 cursor-pointer" ,
                              onClick: () => openEdit(user), __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}

                              , React.createElement(Edit, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}} ), "Ubah Pengguna"

                            )
                            , React.createElement(DropdownMenuItem, { className: "gap-2 cursor-pointer" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
                              , React.createElement(Key, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}} ), "Atur Ulang Sandi"

                            )
                            , React.createElement(DropdownMenuSeparator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}} )
                            , user.status === 'active' ? (
                              React.createElement(DropdownMenuItem, { className: "gap-2 cursor-pointer text-status-rejected"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
                                , React.createElement(UserX, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}} ), "Nonaktifkan Pengguna"

                              )
                            ) : (
                              React.createElement(DropdownMenuItem, { className: "gap-2 cursor-pointer text-status-approved"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                                , React.createElement(UserCheck, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}} ), "Aktifkan Pengguna"

                              )
                            )
                          )
                        )
                      )
                    )
                  )
                ))
              )
            )
          )
        )

        /* Permission Matrix */
        , React.createElement(Card, { className: "card-ocean mt-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
            , React.createElement(CardTitle, { className: "text-base font-semibold" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}, "Hak Akses" )
          )
          , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}
            , React.createElement('div', { className: "overflow-x-auto", __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
              , React.createElement('table', { className: "w-full text-sm table-fixed" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}
                , React.createElement('colgroup', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
                  , React.createElement('col', { className: "w-[40%]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}} )
                  , React.createElement('col', { className: "w-[20%]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}} )
                  , React.createElement('col', { className: "w-[20%]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}} )
                  , React.createElement('col', { className: "w-[20%]"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}} )
                )
                , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}
                  , React.createElement('tr', { className: "border-b border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                    , React.createElement('th', { className: "text-left py-2 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}, "Izin")
                    , React.createElement('th', { className: "text-center py-2 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}, "Admin Utama")
                    , React.createElement('th', { className: "text-center py-2 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}, "Admin Tiket" )
                    , React.createElement('th', { className: "text-center py-2 font-medium"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, "Petugas Tiket" )
                  )
                )
                , React.createElement('tbody', { className: "divide-y divide-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
                  , permissions.map((row, i) => (
                    React.createElement('tr', { key: i, __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
                      , React.createElement('td', { className: "py-2 text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, row.perm)
                      , React.createElement('td', { className: "text-center py-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}
                        , React.createElement('div', { className: "flex justify-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
                          , React.createElement(Checkbox, {
                            checked: row.admin_utama,
                            onCheckedChange: (checked) => handlePermissionToggle(i, 'admin_utama', checked),
                            'aria-label': `Izin ${row.perm} untuk Admin Utama`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}
                          )
                        )
                      )
                      , React.createElement('td', { className: "text-center py-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 275}}
                        , React.createElement('div', { className: "flex justify-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
                          , React.createElement(Checkbox, {
                            checked: row.admin_tiket,
                            onCheckedChange: (checked) => handlePermissionToggle(i, 'admin_tiket', checked),
                            'aria-label': `Izin ${row.perm} untuk Admin Tiket`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 277}}
                          )
                        )
                      )
                      , React.createElement('td', { className: "text-center py-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                        , React.createElement('div', { className: "flex justify-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
                          , React.createElement(Checkbox, {
                            checked: row.petugas_tiket,
                            onCheckedChange: (checked) => handlePermissionToggle(i, 'petugas_tiket', checked),
                            'aria-label': `Izin ${row.perm} untuk Petugas Tiket`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 286}}
                          )
                        )
                      )
                    )
                  ))
                )
              )
            )
          )
        )
      )

      /* Add User Dialog */
      , React.createElement(Dialog, { open: showAddDialog, onOpenChange: setShowAddDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 306}}, "Tambah Pengguna Baru"  )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}, "Tambahkan pengguna baru ke sistem"    )
          )
          , React.createElement('div', { className: "space-y-4 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
              , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}, "Nama Lengkap" )
              , React.createElement(Input, { placeholder: "Budi Santoso" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}} )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}
              , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}, "Email")
              , React.createElement(Input, { type: "email", placeholder: "budi@rajaampat.go.id", __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}} )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
              , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}, "Peran")
              , React.createElement(Select, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}
                , React.createElement(SelectTrigger, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
                  , React.createElement(SelectValue, { placeholder: "Pilih peran" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}} )
                )
                , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}
                  , React.createElement(SelectItem, { value: "admin_utama", __self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, "Admin Utama")
                  , React.createElement(SelectItem, { value: "admin_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}, "Admin Tiket" )
                  , React.createElement(SelectItem, { value: "petugas_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Petugas Tiket" )
                )
              )
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}
            , React.createElement(Button, { variant: "outline", onClick: () => setShowAddDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}, "Batal"

            )
            , React.createElement(Button, { className: "btn-ocean gap-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 336}}
              , React.createElement(Mail, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}} ), "Kirim Undangan"

            )
          )
        )
      )

      /* Edit User Dialog */
      , React.createElement(Dialog, { open: showEditDialog, onOpenChange: setShowEditDialog, __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}
        , React.createElement(DialogContent, { className: "bg-card border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}
          , React.createElement(DialogHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
            , React.createElement(DialogTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, "Ubah Pengguna" )
            , React.createElement(DialogDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "Ubah informasi pengguna"  )
          )
          , selectedUser && (
            React.createElement('div', { className: "space-y-4 py-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}, "Nama Lengkap" )
                , React.createElement(Input, { defaultValue: selectedUser.name, __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}} )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}, "Email")
                , React.createElement(Input, { type: "email", defaultValue: selectedUser.email, __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}} )
              )
              , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}
                , React.createElement(Label, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}, "Peran")
                , React.createElement(Select, { defaultValue: selectedUser.role, __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
                  , React.createElement(SelectTrigger, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
                    , React.createElement(SelectValue, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}} )
                  )
                , React.createElement(SelectContent, { className: "bg-popover border-border" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
                  , React.createElement(SelectItem, { value: "admin_utama", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}, "Admin Utama")
                  , React.createElement(SelectItem, { value: "admin_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}, "Admin Tiket" )
                  , React.createElement(SelectItem, { value: "petugas_tiket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}, "Petugas Tiket" )
                )
              )
            )
            )
          )
          , React.createElement(DialogFooter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
            , React.createElement(Button, { variant: "outline", onClick: () => setShowEditDialog(false), __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Batal"

            )
            , React.createElement(Button, { className: "btn-ocean", __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}, "Simpan")
          )
        )
      )
    )
  );
}
