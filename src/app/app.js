import axios from 'axios';
import env from '../env';
import moment from 'moment';
import { Contact } from '../data/contact';

export default {
  name: 'app',
  data() {
    return {
      contacts: [],
      contact: new Contact(),
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      axios.get(env.apiUrl + '/contacts').then(response => {
        this.contacts.splice(0, this.contacts.length, ...response.data.map(a => new Contact(a)));
        this.sort();
      }, e => console.error(e));
    },
    sort() {
      this.contacts.splice(0, this.contacts.length, ...this.contacts.sort((a, b) => {
        return (a.firstname + a.lastname).localeCompare(b.firstname + b.lastname);
      }));
    },
    add(contact) {
      axios.post(env.apiUrl + '/contacts', contact).then(response => {
        this.contacts.push(new Contact(response.data));
        this.sort();
      }, e => console.error(e));
      this.$refs.dialog.close();
    },
    update(contact) {
      axios.put(env.apiUrl + '/contacts', contact).then(response => {
        this.contacts.find(a => a.id === contact.id).setTo(contact);
        this.sort();
      }, e => console.error(e))
    },
    remove(contact) {
      axios.delete(env.apiUrl + '/contacts/' + contact.id).then(response => {
        this.contacts.splice(0, this.contacts.length, ...this.contacts.filter(a => a.id !== contact.id));
      }, e => console.error(e));
    },
    save() {
      if(this.contact.id) this.update(this.contact.serialize());
      else this.add(this.contact.serialize());
      this.$refs.dialog.close();
    },
    showDialog(contact) {
      this.contact.setTo(contact || new Contact());
      this.$nextTick(() => { this.errors.clear(); this.$refs.dialog.open(); });
    },
    cancel() {
      this.$refs.dialog.close();
    },
    submit(e) { console.log('submit', e); }
  }
}
