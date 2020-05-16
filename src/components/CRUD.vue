<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="name"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>My CRUD Products</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="600px" persistent>
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2 text-none" v-on="on">New Product</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.referenceCode"
                      outlined
                      label="Reference Code"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.name"
                      outlined
                      label="Name"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.description"
                      outlined
                      label="Description"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.price"
                      outlined
                      label="Price"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.quantity"
                      outlined
                      label="Quantity"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error darken-1" medium text elevation="2" @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" medium dark elevation="2" @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.createdAt="{ item }">
        {{new Date(item.createdAt.seconds * 1000)}}
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)" color="primary">mdi-pencil</v-icon>
      <v-icon small @click="deleteItem(item)" color="error">mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { db , Timestamp } from '../plugins/db'
const NAME_COLLECTION_PRODUCTS = 'products'
export default {
  data: () => ({
    dialog: false,
    headers: [
      { text: 'Reference Code', align: 'center', value: 'referenceCode' },
      {
        text: 'Produt',
        align: 'center',
        sortable: true,
        value: 'name',
      },
      { text: 'Description', align: 'center', value: 'description' },
      { text: 'Price', align: 'center', value: 'price' },
      { text: 'Quantity', align: 'center', value: 'quantity' },
      { text: 'Created At', align: 'center', value: 'createdAt' },
      { text: 'Actions', align: 'center', value: 'actions', sortable: false },
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      referenceCode: null,
      name: null,
      description: null,
      price: 0,
      quantity: 0,
      createdAt: null,
      updatedAt: null,
    },
    defaultItem: {
      referenceCode: null,
      name: null,
      description: null,
      price: 0,
      quantity: 0,
      createdAt: null,
      updatedAt: null,
    },
  }),

  firestore: {
    products: db.collection(NAME_COLLECTION_PRODUCTS),
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Product' : 'Edit Product'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {},

    editItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.id = item.id
      this.dialog = true
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this product?') &&
        db.collection(NAME_COLLECTION_PRODUCTS).doc(item.id).delete()
    },

    save() {
      if (this.editedIndex > -1) {
        this.editedItem.updatedAt = Timestamp.now()
        db.collection(NAME_COLLECTION_PRODUCTS).doc(this.editedItem.id).update(this.editedItem)
      } else {
        this.editedItem.createdAt = Timestamp.now()
        this.editedItem.updatedAt = Timestamp.now()
        db.collection(NAME_COLLECTION_PRODUCTS).add(this.editedItem)
      }
      this.close()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
