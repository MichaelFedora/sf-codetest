import axios from 'axios';
import env from '../env';
import moment from 'moment';

export default {
  name: 'app',
  data() {
    return {
      contacts: [],
      contact: null,
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      axios.get(env.apiUrl + '/contacts').then(response => {
        this.contacts.splice(0, this.contacts.length, ...response.data);
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
        this.contacts.push(response.data);
        this.sort();
      }, e => console.error(e));
      this.$refs.dialog.close();
    },
    update(contact) {
      axios.put(env.apiUrl + '/contacts', contact).then(response => {
        Object.assign(this.contacts.find(a => a.id === contact.id), contact);
        this.sort();
      }, e => console.error(e))
    },
    remove(contact) {
      axios.delete(env.apiUrl + '/contacts/' + contact.id).then(response => {
        this.contacts.splice(0, this.contacts.length, ...this.contacts.filter(a => a.id !== contact.id));
      }, e => console.error(e));
    },
    save() {
      const c = Object.assign({}, this.contact);
      c.dob = new Date(c.dob).toISOString();
      console.log(this.contact.dob, c.dob);
      if(c.id) this.update(c);
      else this.add(c);
      this.$refs.dialog.close();
    },
    showDialog(contact) {
      this.contact = contact ? Object.assign({}, contact) : {};
      this.contact.dob = moment.utc(this.contact.dob).format('YYYY-MM-DD');
      this.$refs.dialog.open();
    },
    cancel() {
      this.$refs.dialog.close();
    },
    format(dob, forInput) {
      return moment.utc(new Date(dob)).format('MM/DD/YYYY');
    }
  }
}
