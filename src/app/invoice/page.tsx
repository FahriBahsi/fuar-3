import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Invoice - Direo',
  description: 'View your invoice details',
};

export default function InvoicePage() {
  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src="/images/breadcrumb1.jpg" alt="" />
        </div>
        

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Listings' },
          ]}
          title="Payment Receipt"
        />
      </section>

      {/* Invoice Content */}
      <section className="payment_receipt section-bg section-padding-strict">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="payment_receipt--wrapper">
                <div className="payment_receipt--contents">
                  <h2 className="atbd_thank_you">Thank you for your order!</h2>
                  <div className="atbd_payment_instructions">
                    <p>Please make your payment directly to our bank account
                      and use your ORDER ID (#499) as a Reference. Our bank account information is given
                      below.</p>
                    <h4>Account details:</h4>
                    <ul className="list-unstyled">
                      <li>Account Name: <span>Direo Inc.</span></li>
                      <li>Account Number: <span>000-123-4567890</span></li>
                      <li>Bank Name: <span>State Bank, Neverland</span></li>
                    </ul>
                    <p>Please remember that your order may be canceled if you do not make your payment within next 72 hours.</p>
                  </div>

                  <div className="row atbd_payment_summary_wrapper">
                    <div className="col-md-12">
                      <p className="atbd_payment_summary">Here is your order summery:</p>
                    </div>
                    <div className="col-lg-6">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>ORDER #</td>
                              <td>499</td>
                            </tr>
                            <tr>
                              <td>Total Amount</td>
                              <td>$ 45.00</td>
                            </tr>
                            <tr>
                              <td>Date</td>
                              <td>March 9, 2019 12:17 pm</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <td>Payment Method</td>
                              <td>Bank Transfer</td>
                            </tr>
                            <tr>
                              <td>Payment Status</td>
                              <td>Created</td>
                            </tr>
                            <tr>
                              <td>Transaction ID</td>
                              <td>#ABCD0123</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <p className="atbd_payment_summary">Ordered Item(s)</p>
                  <div className="checkout-table table-responsive">
                    <table id="directorist-checkout-table" className="table table-bordered">
                      <thead>
                        <tr>
                          <th colSpan={2}>Details</th>
                          <th><strong>Price</strong></th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td colSpan={2}>
                            <h4>Basic Plan</h4>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Explicabo, labore.</p>
                          </td>
                          <td>
                            $45.00
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={2} className="text-right">
                            <strong>Total amount</strong>
                          </td>
                          <td className="">
                            <div id="atbdp_checkout_total_amount">$45.00</div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center m-top-30">
                    <a href="" className="btn btn-primary">View your listings</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
