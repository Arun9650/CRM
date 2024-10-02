import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import the input component from Shadcn UI
import { Edit } from 'lucide-react';

interface Enquiry {
    enquiryid: number;
    custname: string;
    custphoneno: string;
    custemailid: string;
    custaddress: string;
    entrytime: string;
    latitude: string;
    longitude: string;
    empid?: number;
    empname?: string;
    DOB?: string;
  }
  
  // Define the EditEnquiryDialogProps interface
  interface EditEnquiryDialogProps {
    enquiry: Enquiry;
    onSave: (updatedEnquiry: Partial<Enquiry>) => void;
  }

const EditEnquiryDialog: React.FC<EditEnquiryDialogProps> = ({ enquiry, onSave }) => {
  const [custname, setCustName] = useState(enquiry.custname);
  const [custphoneno, setCustPhoneNo] = useState(enquiry.custphoneno);
  const [custemailid, setCustEmailId] = useState(enquiry.custemailid);

  const handleSave = () => {
    const updatedEnquiry = {
      custname,
      custphoneno,
      custemailid,
    };
    onSave(updatedEnquiry); // Trigger save with updated data
  };

  return (
    <Dialog>
      <DialogTrigger asChild className='mx-4'>
        {/* This button will trigger the dialog */}
        <button className="text-blue-600 hover:text-blue-900"><Edit className="h-5 w-5" /></button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Enquiry</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={custname}
            onChange={(e) => setCustName(e.target.value)}
            placeholder="Customer Name"
            className="w-full"
          />
          <Input
            value={custphoneno}
            onChange={(e) => setCustPhoneNo(e.target.value)}
            placeholder="Customer Phone Number"
            className="w-full"
          />
          <Input
            value={custemailid}
            onChange={(e) => setCustEmailId(e.target.value)}
            placeholder="Customer Email"
            className="w-full"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEnquiryDialog;
